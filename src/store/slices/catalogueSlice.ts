import { createSlice } from "@reduxjs/toolkit";
import { productsService } from "@/services/products.service";
import { serializeError, type SerializedApiError } from "@/services/apiClient";
import type { Product, ProductList, ProductQuery } from "@/types/product";
import { createAppThunk, errorFrom } from "../thunk";

type Status = "idle" | "loading" | "succeeded" | "failed";
export interface CatalogueState {
  list: ProductList | null;
  query: ProductQuery;
  listStatus: Status;
  listError: SerializedApiError | null;
  /** Only the latest list request may write results (older, slower ones are ignored). */
  listRequestId: string | null;

  /** Product detail cache by id. */
  byId: Record<string, Product>;
  detailStatus: Status;
  detailError: SerializedApiError | null; // 404 PRODUCT_NOT_FOUND => show a "missing" state
  detailRequestId: string | null;
}
const initialState: CatalogueState = {
  list: null, query: {}, listStatus: "idle", listError: null, listRequestId: null,
  byId: {}, detailStatus: "idle", detailError: null, detailRequestId: null,
};

/** Catalogue page / search / filters / pagination. Prices are in kobo. */
export const fetchProducts = createAppThunk("catalogue/fetchProducts", async (query: ProductQuery | undefined, { rejectWithValue, signal }) => {
  try {
    const q = query ?? {};
    return { query: q, list: await productsService.list(q, signal) };
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
});

export const fetchProduct = createAppThunk("catalogue/fetchProduct", async (id: string, { rejectWithValue, signal }) => {
  try {
    return await productsService.get(id, signal);
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
});

const catalogueSlice = createSlice({
  name: "catalogue",
  initialState,
  reducers: {
    clearProductDetail(state) {
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s, a) => {
      s.listStatus = "loading";
      s.listError = null;
      s.listRequestId = a.meta.requestId;
      s.query = a.meta.arg ?? {};
    });
    b.addCase(fetchProducts.fulfilled, (s, a) => {
      if (s.listRequestId !== a.meta.requestId) return;
      s.list = a.payload.list;
      s.listStatus = "succeeded";
      for (const p of a.payload.list.items) s.byId[p.id] = p;
    });
    b.addCase(fetchProducts.rejected, (s, a) => {
      if (a.meta.aborted || s.listRequestId !== a.meta.requestId) return;
      s.listStatus = "failed";
      s.listError = errorFrom(a);
    });

    b.addCase(fetchProduct.pending, (s, a) => {
      s.detailStatus = "loading";
      s.detailError = null;
      s.detailRequestId = a.meta.requestId;
    });
    b.addCase(fetchProduct.fulfilled, (s, a) => {
      if (s.detailRequestId !== a.meta.requestId) return;
      s.byId[a.payload.id] = a.payload;
      s.detailStatus = "succeeded";
    });
    b.addCase(fetchProduct.rejected, (s, a) => {
      if (a.meta.aborted || s.detailRequestId !== a.meta.requestId) return;
      s.detailStatus = "failed";
      s.detailError = errorFrom(a);
    });
  },
});

export const { clearProductDetail } = catalogueSlice.actions;
export default catalogueSlice.reducer;

type S = { catalogue: CatalogueState };
export const selectCatalogue = (s: S) => s.catalogue;
export const selectProductById = (id: string) => (s: S): Product | undefined => s.catalogue.byId[id];
