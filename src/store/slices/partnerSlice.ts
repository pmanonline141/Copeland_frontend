import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { partnersService } from "@/services/partners.service";
import { serializeError, type SerializedApiError } from "@/services/apiClient";
import type { BankVerifyInput, BankVerifyResponse, Partner, PartnerApplyInput, PartnerDocumentType } from "@/types/partner";
import { createAppThunk, errorFrom } from "../thunk";
import { sessionCleared, signOut } from "./authSlice";

export interface DocumentUpload {
  status: "idle" | "uploading" | "done" | "failed";
  documentId?: string;
  path?: string;
  fileName?: string;
  error?: SerializedApiError;
}
export interface PartnerState {
  application: Partner | null; // returned with status "pending"
  applying: boolean;
  documents: Record<PartnerDocumentType, DocumentUpload>;
  bank: BankVerifyResponse | null;
  verifyingBank: boolean;
  error: SerializedApiError | null; // 400 INVALID_APPLICATION / 400 APPLICATION_EXISTS / 500 ...
}
const emptyDocs = (): PartnerState["documents"] => ({ cac: { status: "idle" }, tin: { status: "idle" }, id: { status: "idle" } });
const initialState: PartnerState = { application: null, applying: false, documents: emptyDocs(), bank: null, verifyingBank: false, error: null };

type S = { partner: PartnerState };

/** Requires a signed-in user. partnerType defaults to "supplier". */
export const applyAsPartner = createAppThunk("partner/apply", async (b: PartnerApplyInput, { rejectWithValue }) => {
  try {
    return await partnersService.apply(b);
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
}, { condition: (_, { getState }) => !(getState() as S).partner.applying });

/** Signed URL + direct upload to storage. The File is not kept in state, only the resulting document id. */
export const uploadPartnerDocument = createAppThunk("partner/uploadDocument", async (a: { documentType: PartnerDocumentType; file: File }, { rejectWithValue }) => {
  try {
    const r = await partnersService.uploadDocument(a.documentType, a.file);
    return { documentType: a.documentType, documentId: r.documentId, path: r.path, fileName: a.file.name };
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
}, { condition: (a, { getState }) => (getState() as S).partner.documents[a.documentType].status !== "uploading" });

export const verifyBankDetails = createAppThunk("partner/verifyBank", async (b: BankVerifyInput, { rejectWithValue }) => {
  try {
    return await partnersService.verifyBankDetails(b);
  } catch (e) {
    return rejectWithValue(serializeError(e));
  }
}, { condition: (_, { getState }) => !(getState() as S).partner.verifyingBank });

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    clearPartnerError(state) {
      state.error = null;
    },
    resetDocument(state, a: PayloadAction<PartnerDocumentType>) {
      state.documents[a.payload] = { status: "idle" };
    },
  },
  extraReducers: (b) => {
    b.addCase(applyAsPartner.pending, (s) => { s.applying = true; s.error = null; });
    b.addCase(applyAsPartner.fulfilled, (s, a) => { s.applying = false; s.application = a.payload; });
    b.addCase(applyAsPartner.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.applying = false;
      s.error = errorFrom(a);
    });

    b.addCase(uploadPartnerDocument.pending, (s, a) => {
      s.documents[a.meta.arg.documentType] = { status: "uploading", fileName: a.meta.arg.file.name };
    });
    b.addCase(uploadPartnerDocument.fulfilled, (s, a) => {
      const { documentType, ...rest } = a.payload;
      s.documents[documentType] = { status: "done", ...rest };
    });
    b.addCase(uploadPartnerDocument.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.documents[a.meta.arg.documentType] = { status: "failed", fileName: a.meta.arg.file.name, error: errorFrom(a) };
    });

    b.addCase(verifyBankDetails.pending, (s) => { s.verifyingBank = true; s.error = null; });
    b.addCase(verifyBankDetails.fulfilled, (s, a) => { s.verifyingBank = false; s.bank = a.payload; });
    b.addCase(verifyBankDetails.rejected, (s, a) => {
      if (a.meta.condition) return;
      s.verifyingBank = false;
      s.error = errorFrom(a);
    });

    // Drop cached partner data when the user signs out or the session ends.
    b.addMatcher((a) => signOut.fulfilled.match(a) || sessionCleared.match(a), () => initialState);
  },
});

export const { clearPartnerError, resetDocument } = partnerSlice.actions;
export default partnerSlice.reducer;
export const selectPartner = (s: S) => s.partner;
