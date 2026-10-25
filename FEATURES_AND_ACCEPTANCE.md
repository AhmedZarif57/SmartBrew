# SmartBrew features and acceptance

This document records the ten selected coursework feature areas against the current browser prototype. “Simulated” means the workflow is deliberately local and demonstrational, not a real external integration.

## 1. Customer authentication and guest access

- **Role:** Customer or guest.
- **Purpose:** Allow a returning demo customer to access preferences and recipes while retaining a browse/order path for guests.
- **Main flow:** `Auth` opens from `Header`; `signIn` compares the seeded customer credentials, sets `role`, and writes an auth log.
- **Alternatives/errors:** Invalid attempts show a notice; the third failure returns to guest mode. Guest users cannot manage private recipes.
- **Inputs/outputs:** Email and password in; role-aware navigation and status notice out.
- **Files:** [src/App.tsx](./src/App.tsx), [src/storage.ts](./src/storage.ts), [src/types.ts](./src/types.ts).
- **Manual checklist:** Sign in successfully; sign out; enter three wrong passwords; verify guest restrictions.
- **Automated coverage:** No UI authentication test; domain tests cover adjacent pure rules only.
- **Status:** Simulated/implemented front-end authentication.

## 2. Browse menu and beverage availability

- **Role:** Customer or guest.
- **Purpose:** Present the machine’s nine seeded drink programs and prevent selection when required stock or maintenance is unavailable.
- **Main flow:** `Menu` filters `DRINKS`, displays cards, and `openDrink` opens configuration.
- **Alternatives/errors:** Search/category filters can return no cards; `stockShortages` labels unavailable drinks; maintenance disables configuration.
- **Inputs/outputs:** Search text, category, and drink selection in; card details and availability state out.
- **Files:** [src/App.tsx](./src/App.tsx), [src/data.ts](./src/data.ts), [src/domain.ts](./src/domain.ts).
- **Manual checklist:** Search and filter; open a drink; inspect low-stock and maintenance states.
- **Automated coverage:** `domain.test.ts` covers shortage calculations.
- **Status:** Implemented.

## 3. Recommendations

- **Role:** Customer or system.
- **Purpose:** Offer three deterministic Smart Picks based on preference, available inventory, and optional weather.
- **Main flow:** `rankRecommendations` uses `getBaseRecommendationOrder`, `applyWeatherAdjustment`, `buildRecommendationReason`, and availability filtering.
- **Alternatives/errors:** Weather failure produces a preference-only message; limited iced or low-calorie options explain compromises; no available drinks shows an empty state.
- **Inputs/outputs:** Preferences, current inventory, order history parameter, and nullable weather in; three ranked cards/reasons out.
- **Files:** [src/App.tsx](./src/App.tsx), [src/domain.ts](./src/domain.ts), [src/domain.test.ts](./src/domain.test.ts).
- **Manual checklist:** Change preferences and city; verify reasons; block Open-Meteo and verify fallback.
- **Automated coverage:** Recommendation combinations, unavailable filtering, and weather nudging are tested.
- **Status:** Implemented with simulated/deterministic recommendation logic.

## 4. Manage recommendation preferences

- **Role:** Customer.
- **Purpose:** Let the customer control taste, temperature, and calorie goal.
- **Main flow:** `Menu` controls call `updatePreferences`, which merges the patch into the customer profile and persistence effect saves it.
- **Alternatives/errors:** Guests can view controls but do not have secure account storage; reset demo data restores seed preferences.
- **Inputs/outputs:** Select values in; updated Smart Picks and persisted browser state out.
- **Files:** [src/App.tsx](./src/App.tsx), [src/storage.ts](./src/storage.ts), [src/types.ts](./src/types.ts).
- **Manual checklist:** Change each control, reload, and use Reset demo data.
- **Automated coverage:** No direct UI persistence test.
- **Status:** Implemented in browser-local storage.

## 5. Customize beverage and validate ingredient availability

- **Role:** Customer or guest.
- **Purpose:** Configure a drink while showing the resulting price/calorie estimate and preventing impossible recipes.
- **Main flow:** `CustomizerContent` edits `custom`; `calculatePrice`, `calculateCalories`, and `stockShortages` derive visible results; `addToCart` validates again.
- **Alternatives/errors:** Unsupported combinations and shortages prevent cart entry; payment performs a final revalidation.
- **Inputs/outputs:** Strength, temperature, milk, syrup, and shot count in; custom totals, shortage messages, and a cart line out.
- **Files:** [src/App.tsx](./src/App.tsx), [src/domain.ts](./src/domain.ts), [src/data.ts](./src/data.ts).
- **Manual checklist:** Change each option; verify totals; demonstrate a shortage through technician inventory.
- **Automated coverage:** Price, calories, requirements, shortages, and deduction are tested.
- **Status:** Implemented.

## 6. Save and manage customer recipes

- **Role:** Customer.
- **Purpose:** Store named personal configurations for later editing or reordering.
- **Main flow:** `saveRecipe` creates/updates `SavedRecipe`; `Recipes` renders the library; `reorder` validates current stock before adding a line.
- **Alternatives/errors:** Guests and blank names cannot save; deleted recipes disappear; shortages prevent reorder.
- **Inputs/outputs:** Recipe name and customization in; saved list, edit state, or shortage notice out.
- **Files:** [src/App.tsx](./src/App.tsx), [src/storage.ts](./src/storage.ts), [src/types.ts](./src/types.ts).
- **Manual checklist:** Save, edit, delete, and order again; try as guest.
- **Automated coverage:** No direct UI recipe test.
- **Status:** Implemented, browser-local.

## 7. Create and review beverage orders

- **Role:** Customer or guest.
- **Purpose:** Build a cart from saved or unsaved menu drinks before payment.
- **Main flow:** `addToCart` creates lines, `Cart` displays them, `changeQuantity` adjusts positive quantities, and `cartTotal` calculates the total.
- **Alternatives/errors:** Empty cart cannot pay; maintenance prevents checkout; stock is not deducted while reviewing.
- **Inputs/outputs:** Drink selections and quantities in; cart lines and SEK total out.
- **Files:** [src/App.tsx](./src/App.tsx), [src/domain.ts](./src/domain.ts), [src/types.ts](./src/types.ts).
- **Manual checklist:** Add two different drinks, change quantities, and confirm review total.
- **Automated coverage:** `cartTotal` is exercised indirectly by domain test imports; no dedicated cart UI test.
- **Status:** Implemented.

## 8. Checkout/payment simulation and receipts

- **Role:** Customer or guest.
- **Purpose:** Demonstrate approval/decline, stock commitment, and optional receipt choices without real money or email.
- **Main flow:** `pay` validates all lines, records simulated outcome, deducts once on approval, and shows `ReceiptPanel`; `chooseQr` calls `createReceiptQr`.
- **Alternatives/errors:** Declined payment preserves stock; shortage stops checkout; email only confirms simulated delivery; No receipt skips output; Print opens the browser dialog.
- **Inputs/outputs:** Payment method/outcome and receipt choice in; order, stock update, QR image, or notices out.
- **Files:** [src/App.tsx](./src/App.tsx), [src/receipts.ts](./src/receipts.ts), [src/domain.ts](./src/domain.ts).
- **Manual checklist:** Try decline, approval, QR, email, no receipt, and print.
- **Automated coverage:** Stock deduction and QR library integration are not covered by UI tests.
- **Status:** Simulated; QR image generation is implemented locally.

## 9. Technician authentication and role-restricted access

- **Role:** Technician.
- **Purpose:** Keep service operations out of customer and guest navigation.
- **Main flow:** Technician `Auth` submits to `signIn`; success sets `role` and opens `Technician`.
- **Alternatives/errors:** Invalid credentials never grant service role; three failures explicitly report that access was not granted.
- **Inputs/outputs:** Technician email/password in; service navigation and console out.
- **Files:** [src/App.tsx](./src/App.tsx), [src/types.ts](./src/types.ts).
- **Manual checklist:** Use invalid credentials, then `tech@smartbrew.demo` / `Tech123!`; verify role-specific controls.
- **Automated coverage:** No UI authentication test.
- **Status:** Simulated front-end role restriction.

## 10. Technician operations

- **Role:** Technician.
- **Purpose:** Demonstrate refill, correction, maintenance recovery, diagnostics, and log review.
- **Main flow:** `Technician` renders tabs; `changeInventory`, `resetBin`, `diagnostic`, and `Logs` perform operations; `addLog` records events.
- **Alternatives/errors:** Negative/non-finite quantities are rejected; capacity caps refills; maintenance lock disables customer checkout; filters can produce an empty log view.
- **Inputs/outputs:** Quantities, maintenance choices, diagnostic action, severity/search filters in; inventory, machine status, notices, and logs out.
- **Files:** [src/App.tsx](./src/App.tsx), [src/domain.ts](./src/domain.ts), [src/data.ts](./src/data.ts), [src/storage.ts](./src/storage.ts).
- **Manual checklist:** Refill/correct, simulate near capacity, empty a bin, diagnose, search and clear log filters.
- **Automated coverage:** `addLog` and domain inventory rules are available; no technician UI test.
- **Status:** Simulated/implemented in the browser.

## Additional visible scope

Natural-language ordering is **Coming Soon / no working LLM deployed**. It is a `Menu` notice only and is not part of the ten implemented feature areas. Facial analysis, camera workflows, NFC/card scanning, real payment, email delivery, and standalone offline mode are intentionally not implemented.
