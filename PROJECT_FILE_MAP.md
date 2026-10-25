# SmartBrew project file map

## Architecture at a glance

SmartBrew is a small React/Vite single-page prototype. [App.tsx](./src/App.tsx) owns screen selection and browser UI state for customer, guest, and technician workflows. [domain.ts](./src/domain.ts) contains pure business rules so prices, stock checks, recommendations, and logs are not duplicated in controls. [data.ts](./src/data.ts) is the catalogue and seed data. [storage.ts](./src/storage.ts) persists one versioned state object in localStorage. [receipts.ts](./src/receipts.ts) creates QR image data locally. [styles.css](./src/styles.css) supplies the retro appliance-screen presentation. Tests and tool configuration are in [domain.test.ts](./src/domain.test.ts), [package.json](./package.json), [vite.config.ts](./vite.config.ts), and the TypeScript configuration files.

## Ten-feature traceability table

| Feature | User-visible behavior | Main file(s) | Supporting file(s) | Important function/component(s) | How to test/demo |
|---|---|---|---|---|---|
| Customer authentication and guest access | Customer sign-in, sign-out, three-failure guest fallback, and guest ordering | [src/App.tsx](./src/App.tsx) | [src/storage.ts](./src/storage.ts), [src/types.ts](./src/types.ts) | `signIn`, `signOut`, `Auth`, `Header` | Use the seeded customer account, then submit three invalid passwords |
| Browse menu and availability | Search, category filters, drink cards, and stock/service availability | [src/App.tsx](./src/App.tsx) | [src/data.ts](./src/data.ts), [src/domain.ts](./src/domain.ts) | `Menu`, `openDrink`, `stockShortages` | Search `latte`, change category, and inspect Configure/Unavailable states |
| Recommendations | Three deterministic Smart Picks with preference, inventory, and weather messaging | [src/App.tsx](./src/App.tsx), [src/domain.ts](./src/domain.ts) | [src/data.ts](./src/data.ts), [src/domain.test.ts](./src/domain.test.ts) | `rankRecommendations`, `buildRecommendationReason`, `applyWeatherAdjustment`, `Menu` | Change Smart Picks controls and city; block weather to test fallback |
| Manage recommendation preferences | Taste, temperature, and calorie controls persist for the customer | [src/App.tsx](./src/App.tsx) | [src/storage.ts](./src/storage.ts), [src/types.ts](./src/types.ts) | `updatePreferences`, `Menu` | Change controls, reload, and verify the values remain |
| Customize and validate beverage | Customizer changes options, price, calories, and availability before cart entry | [src/App.tsx](./src/App.tsx) | [src/domain.ts](./src/domain.ts), [src/data.ts](./src/data.ts) | `CustomizerContent`, `calculatePrice`, `calculateCalories`, `stockShortages`, `addToCart` | Configure a latte; lower stock or use technician mode to demonstrate a shortage |
| Save and manage recipes | Customer can save, edit, delete, and order a named recipe | [src/App.tsx](./src/App.tsx) | [src/storage.ts](./src/storage.ts), [src/types.ts](./src/types.ts) | `saveRecipe`, `Recipes`, `reorder` | Sign in, configure, save a name, then edit/delete/order again |
| Create and review orders | Saved and unsaved cart lines can be reviewed and quantities changed | [src/App.tsx](./src/App.tsx) | [src/domain.ts](./src/domain.ts), [src/types.ts](./src/types.ts) | `addToCart`, `changeQuantity`, `Cart`, `cartTotal` | Add two drinks, open Order review, change quantity, verify total |
| Checkout, payment, receipts | Approved/declined simulation, one stock deduction, QR/email/no-receipt/print choices | [src/App.tsx](./src/App.tsx), [src/receipts.ts](./src/receipts.ts) | [src/domain.ts](./src/domain.ts), [src/storage.ts](./src/storage.ts) | `pay`, `chooseQr`, `ReceiptPanel`, `createReceiptQr` | Try Declined then Approved; choose each receipt path |
| Technician authentication and restricted access | Only technician role exposes service navigation and service controls | [src/App.tsx](./src/App.tsx) | [src/types.ts](./src/types.ts), [src/storage.ts](./src/storage.ts) | `signIn`, `Auth`, `Technician`, `Header` | Use technician credentials and compare guest/customer navigation |
| Technician operations | Inventory refill/correction, maintenance lock/reset, diagnostic, and log filtering | [src/App.tsx](./src/App.tsx), [src/domain.ts](./src/domain.ts) | [src/data.ts](./src/data.ts), [src/storage.ts](./src/storage.ts) | `changeInventory`, `resetBin`, `diagnostic`, `InventoryRow`, `Logs`, `addLog` | Use Service console tabs, simulate near-capacity, reset, diagnose, and filter logs |

Natural-language ordering is visible in `Menu` as **Coming Soon** and has no working LLM implementation.

## File-by-file guide

- [src/App.tsx](./src/App.tsx) — UI shell and all workflow components: `App`, `Header`, `Menu`, `CustomizerContent`, `Cart`, `Recipes`, `ReceiptPanel`, `Technician`, `InventoryRow`, `Logs`, and `Auth`. It imports catalogue data, domain rules, storage, receipts, and types.
- [src/domain.ts](./src/domain.ts) — pure business logic: `calculatePrice`, `calculateCalories`, `requirements`, `stockShortages`, `deductStock`, `cartTotal`, recommendation ranking/reasons/weather adjustment, `makeId`, and `addLog`.
- [src/data.ts](./src/data.ts) — `DRINKS`, `INITIAL_INVENTORY`, `INITIAL_MACHINE`, and `INITIAL_LOGS`.
- [src/types.ts](./src/types.ts) — shared domain types such as `Drink`, `Customization`, `Order`, `Preferences`, `MachineStatus`, and `SystemLogEntry`.
- [src/storage.ts](./src/storage.ts) — `seedState`, `loadState`, `saveState`, and `resetState`; localStorage is the only persistence.
- [src/receipts.ts](./src/receipts.ts) — `createReceiptQr`, which calls the local `qrcode` library.
- [src/main.tsx](./src/main.tsx) — React entry point, Strict Mode, and stylesheet import.
- [src/styles.css](./src/styles.css) — machine casing, display, controls, responsive layout, focus states, and status styles.
- [src/domain.test.ts](./src/domain.test.ts) — six Vitest tests for pricing/calories, requirements/shortages, atomic stock deduction, recommendation combinations, availability filtering, and weather nudging.
- [index.html](./index.html) — browser document shell and root element.
- [package.json](./package.json) — npm scripts and dependency ranges.
- [package-lock.json](./package-lock.json) — reproducible npm dependency resolution.
- [vite.config.ts](./vite.config.ts) — Vite React plugin configuration.
- [tsconfig.json](./tsconfig.json), [tsconfig.app.json](./tsconfig.app.json), [tsconfig.node.json](./tsconfig.node.json) — strict TypeScript and Vite build settings.
- [README.md](./README.md) — setup, feature walkthrough, limitations, and verification.

## Important execution paths

### Customer order

`Menu` calls `openDrink`, which initializes `custom`. `CustomizerContent` displays `calculatePrice`, `calculateCalories`, and `stockShortages`. `addToCart` creates a `CartItem` without changing inventory. `Cart` calls `pay`; `pay` rechecks every line with `stockShortages`, branches for simulated decline, or calls `deductStock`, creates an `Order`, updates state, and displays `ReceiptPanel`. `chooseQr` calls `createReceiptQr` for the local QR image.

### Recommendations

`Menu` derives recommendations with `rankRecommendations`. The domain function selects the explicit baseline from `getBaseRecommendationOrder`, applies at most one weather position adjustment, filters unavailable recipes with `stockShortages`, and creates truthful explanations with `buildRecommendationReason`. `App` obtains optional Open-Meteo weather and passes null on failure.

### Technician service

`signIn` accepts the seeded technician credentials and sets role `technician`, which exposes `Technician`. Inventory controls call `changeInventory`; maintenance buttons call `resetBin` or `diagnostic`; every operation updates state and prepends an `addLog` entry. `Logs` filters the newest-first list locally.

## Configuration and test map

`package.json` defines `npm run dev`, `npm test`, and `npm run build`. Vitest discovers [src/domain.test.ts](./src/domain.test.ts). The production build is TypeScript project compilation followed by Vite using [vite.config.ts](./vite.config.ts), with output in `dist/`. No environment variables or test database are required.

## Accuracy rule

All paths and symbols in this map refer to the current source. The browser UI intentionally keeps multiple small components and workflow handlers in `App.tsx`; the project does not introduce a router or backend because neither is required by this prototype.
