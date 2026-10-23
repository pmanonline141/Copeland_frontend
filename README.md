# Copeland frontend

Next.js (App Router) + TypeScript + Redux Toolkit + Tailwind 3. Talks to the Copeland REST API.

## Run
```bash
npm install
cp .env.example .env.local     # then set NEXT_PUBLIC_API_URL to the deployed API
npm run dev                    # http://localhost:3000
npm run typecheck && npm run build
```
The API must list this site's origin (for example `http://localhost:3000`) in its allowed origins, because requests carry the session cookie.

## Structure (src/)
```
app/                 routes only: layout, pages, loading, error, not-found
components/
  providers/         StoreProvider (Redux)
  ui/                Spinner, GlobalLoader, AlertHost, Modal   (add shared pieces here)
hooks/               useAlert, useLoading, useRequireAuth                      (add reusable hooks here)
services/            apiClient.ts  <- the only place that calls fetch
                     auth, products, orders, rfqs, partners, shipping, admin, settlements, health
                     (one file per API area; import from "@/services")
store/
  index.ts           root reducer + makeStore   <- register new slices here
  hooks.ts           typed useAppDispatch / useAppSelector
  notify.ts          alerts from non-component code
  thunk.ts           createAppThunk (typed rejects) + errorFrom
  persist.ts         safe localStorage/sessionStorage helpers (cart + pending order only)
  slices/            ui, auth, cart, catalogue, checkout (orders/pay/lookup/RFQ), partner
types/               api.ts, auth, product, order, rfq, partner, shipping, admin
utils/               cn, formatMinor, formatDate
```

## How to
- **Add an API call:** create `services/x.service.ts` using `api.get/post/patch/delete` from `apiClient`. Errors arrive as `ApiError` with a user-safe `message`.
- **Show an alert:** in a component `const alert = useAlert(); alert.success("Saved")`; elsewhere `notify.error(getErrorMessage(err))`.
- **Show the full-screen loader:** `const withLoading = useLoading(); await withLoading(() => api.post(...))`. For a local spinner use `<Spinner />`.
- **Add a slice:** create `store/slices/xSlice.ts`, add it to `combineReducers` in `store/index.ts`.
- **Tailwind:** paste your config into `tailwind.config.ts` (keep `content` pointing at `./src/**/*.{ts,tsx}`).

## API integration notes
- **Auth** (Better Auth, cookie session): `fetchSession` runs on app start and after any 401; `signIn` -> 403 sets `auth.needsVerification` (show a resend button); sign-up does not sign in. Guard pages with `useRequireAuth(["supplier"])`.
- **Checkout:** `placeOrderAndPay(input)` creates the order then initialises payment; redirect to `checkout.paymentUrl`. If payment init fails the order (and reserved stock) still exists: retry `payForOrder(order.id)`. The cart empties when the order is created; the unpaid order id/email persist in sessionStorage (`checkout.pendingOrder`).
- **Never trust the client:** cart prices are display estimates; the API computes totals, commission and payouts.
- **Duplicate submits:** every mutating thunk is blocked while a request is in flight (`condition`), and slices expose `creating`/`paying`/... flags for disabling buttons.
- **callbackURL / redirectTo** (verification and reset emails) must be origins the API allows in `FRONTEND_ORIGINS`.
- Role dashboards (supplier, shipping, staff/admin) have typed services ready (`productsService.mine`, `adminService.*`, `settlementsService.*` ...) but no slices yet.
# Copeland_frontend
