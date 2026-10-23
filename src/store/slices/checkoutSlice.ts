import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ordersService } from "@/services/orders.service";
import { rfqsService } from "@/services/rfqs.service";
import { serializeError, type SerializedApiError } from "@/services/apiClient";
import type { CheckoutInput, LookupInput, Order } from "@/types/order";
import { getPaymentUrl } from "@/types/order";
import type { Rfq, RfqInput, RfqResponseInput } from "@/types/rfq";
import { createAppThunk, errorFrom } from "../thunk";

/** The few fields kept (in sessionStorage) so a buyer can resume payment or look the order up after a redirect. */
export interface PendingOrder {
  id: string;
  orderNumber?: string;
  email: string;
}

export interface CheckoutState {
  order: Order | null;
  pendingOrder: PendingOrder | null;
  paymentUrl: string | null;
  paymentReference: string | null;
  creating: boolean;
  paying: boolean;
  /** Composed create+pay flow in progress (blocks double submits before the inner request starts). */
  placing: boolean;
  cancelling: boolean;
  lookingUp: boolean;
  lookupResult: Order | null;
  rfq: Rfq | null;
  rfqSubmitting: boolean;
  rfqResponding: boolean;
  error: SerializedApiError | null;
}
const initialState: CheckoutState = {
  order: null, pendingOrder: null, paymentUrl: null, paymentReference: null,
  creating: false, paying: false, placing: false, cancelling: false, lookingUp: false, lookupResult: null,
  rfq: null, rfqSubmitting: false, rfqResponding: false, error: null,
};

type S = { checkout: CheckoutState };
const flag = (k: keyof CheckoutState) => (_: unknown, { getState }: { getState: () => unknown }) => !(getState() as S).checkout[k];

/** POST /api/orders/checkout: creates a pending-payment order and reserves stock. */
export const createOrder = createAppThunk("checkout/createOrder", async (input: CheckoutInput, { rejectWithValue }) => {
  try {
    return await ordersService.checkout(input);
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
}, { condition: flag("creating") });

/** POST /api/orders/:id/pay: the amount comes from the server; the UI only redirects to the returned URL. */
export const payForOrder = createAppThunk("checkout/payForOrder", async (orderId: string, { rejectWithValue }) => {
  try {
    return await ordersService.pay(orderId);
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
}, { condition: flag("paying") });

/**
 * Create the order, then initialise payment. If payment fails the order still exists (stock is reserved),
 * so retry with payForOrder(order.id) rather than calling this again.
 */
export const placeOrderAndPay = createAppThunk("checkout/placeOrderAndPay", async (input: CheckoutInput, { dispatch, rejectWithValue }) => {
  try {
    const { order } = await dispatch(createOrder(input)).unwrap();
    const pay = await dispatch(payForOrder(order.id)).unwrap();
    return { order, paymentUrl: getPaymentUrl(pay.paymentData) };
  } catch (e) {
    // Inner thunks reject with a SerializedApiError; anything else (e.g. a skipped duplicate) is normalised.
    const known = typeof e === "object" && e !== null && "status" in e && "code" in e;
    return rejectWithValue(known ? (e as SerializedApiError) : serializeError(e));
  }
}, { condition: (_, { getState }) => { const c = (getState() as S).checkout; return !c.placing && !c.creating && !c.paying; } });

export const cancelOrder = createAppThunk("checkout/cancelOrder", async (a: { orderId: string; email: string }, { rejectWithValue }) => {
  try {
    return await ordersService.cancel(a.orderId, a.email);
  } catch (e) {
    return rejectWithValue(serializeError(e)); // 409 ORDER_NOT_CANCELLABLE => "order changed state"
  }
}, { condition: flag("cancelling") });

export const lookupOrder = createAppThunk("checkout/lookupOrder", async (b: LookupInput, { rejectWithValue }) => {
  try {
    return await ordersService.lookup(b);
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
}, { condition: flag("lookingUp") });

export const submitRfq = createAppThunk("checkout/submitRfq", async (b: RfqInput, { rejectWithValue }) => {
  try {
    return await rfqsService.create(b);
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
}, { condition: flag("rfqSubmitting") });

export const respondToRfq = createAppThunk("checkout/respondToRfq", async (a: { id: string; body: RfqResponseInput }, { rejectWithValue }) => {
  try {
    return await rfqsService.respond(a.id, a.body);
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
}, { condition: flag("rfqResponding") });

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    hydratePendingOrder(state, a: PayloadAction<PendingOrder | null>) {
      if (!state.pendingOrder) state.pendingOrder = a.payload;
    },
    /** Call after a confirmed payment, or when the buyer abandons the order. */
    clearPendingOrder(state) {
      state.pendingOrder = null;
      state.order = null;
      state.paymentUrl = null;
      state.paymentReference = null;
    },
    clearCheckoutError(state) {
      state.error = null;
    },
    clearLookup(state) {
      state.lookupResult = null;
      state.error = null;
    },
    clearRfq(state) {
      state.rfq = null;
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(createOrder.pending, (s) => { s.creating = true; s.error = null; });
    b.addCase(createOrder.fulfilled, (s, a) => {
      s.creating = false;
      s.order = a.payload.order;
      s.paymentUrl = null;
      s.pendingOrder = { id: a.payload.order.id, orderNumber: a.payload.order.orderNumber, email: a.meta.arg.email.trim().toLowerCase() };
    });
    b.addCase(createOrder.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.creating = false;
      s.error = errorFrom(a); // 400 INVALID_CHECKOUT / CHECKOUT_FAILED
    });

    b.addCase(payForOrder.pending, (s) => { s.paying = true; s.error = null; });
    b.addCase(payForOrder.fulfilled, (s, a) => {
      s.paying = false;
      s.paymentUrl = getPaymentUrl(a.payload.paymentData);
      const ref = a.payload.paymentData?.reference;
      s.paymentReference = typeof ref === "string" ? ref : null; // keep for support cases
    });
    b.addCase(payForOrder.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.paying = false;
      s.error = errorFrom(a); // 400 PAYMENT_INITIALIZATION_FAILED
    });

    b.addCase(placeOrderAndPay.pending, (s) => { s.placing = true; });
    b.addCase(placeOrderAndPay.fulfilled, (s) => { s.placing = false; });
    b.addCase(placeOrderAndPay.rejected, (s, a) => { if (!a.meta.condition) s.placing = false; });

    b.addCase(cancelOrder.pending, (s) => { s.cancelling = true; s.error = null; });
    b.addCase(cancelOrder.fulfilled, (s) => {
      s.cancelling = false;
      s.order = null;
      s.pendingOrder = null;
      s.paymentUrl = null;
      s.paymentReference = null;
    });
    b.addCase(cancelOrder.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.cancelling = false;
      s.error = errorFrom(a);
    });

    b.addCase(lookupOrder.pending, (s) => { s.lookingUp = true; s.error = null; s.lookupResult = null; });
    b.addCase(lookupOrder.fulfilled, (s, a) => { s.lookingUp = false; s.lookupResult = a.payload; });
    b.addCase(lookupOrder.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.lookingUp = false;
      s.error = errorFrom(a); // 404 ORDER_NOT_FOUND
    });

    b.addCase(submitRfq.pending, (s) => { s.rfqSubmitting = true; s.error = null; });
    b.addCase(submitRfq.fulfilled, (s, a) => { s.rfqSubmitting = false; s.rfq = a.payload; });
    b.addCase(submitRfq.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.rfqSubmitting = false;
      s.error = errorFrom(a);
    });

    b.addCase(respondToRfq.pending, (s) => { s.rfqResponding = true; s.error = null; });
    b.addCase(respondToRfq.fulfilled, (s, a) => { s.rfqResponding = false; s.rfq = a.payload; });
    b.addCase(respondToRfq.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.rfqResponding = false;
      s.error = errorFrom(a);
    });
  },
});

export const { hydratePendingOrder, clearPendingOrder, clearCheckoutError, clearLookup, clearRfq } = checkoutSlice.actions;
export default checkoutSlice.reducer;

export const selectCheckout = (s: S) => s.checkout;
export const selectCheckoutBusy = (s: S) => s.checkout.creating || s.checkout.paying || s.checkout.placing || s.checkout.cancelling;
