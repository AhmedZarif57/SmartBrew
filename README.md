# SmartBrew

SmartBrew is a browser-demonstrated machine-control UI prototype for a warm retro beverage-brewing station. The rectangular appliance screen is simulated in the browser; it does not control real pumps, grinders, heaters, payment terminals, or other hardware. It implements customer authentication and guest access, a searchable menu, deterministic Smart Picks, live drink customization, personal recipes, cart and order submission, simulated payment, QR/email/no-receipt handling, technician authentication, and a technician console for inventory, maintenance, and logs.

## Technology and prerequisites

- Node.js 20.19+ or 22.12+, with npm
- React 18, TypeScript, and Vite
- Plain CSS and browser `localStorage` for the persistent demo state
- Open-Meteo public forecast API (no API key)
- `qrcode` for real dynamic receipt QR codes
- Vitest for focused domain unit tests

## Install and run

```bash
npm install
npm run dev
npm run build
npm run test
```

Open the Vite URL shown in the terminal. The payment processor, authentication, and email delivery are deliberately local simulations; no real money, card data, CVV, or password transmission is involved.

## Demo credentials

- Customer: `customer@smartbrew.demo` / `brew123`
- Technician: `tech@smartbrew.demo` / `Tech123!`

## Demonstration guide

1. **Authentication and guest access:** Choose Customer sign in and use the demo account. Sign out, enter three incorrect customer passwords, and observe the guest fallback. Guests can still browse and order but cannot save private recipes.
2. **Menu:** Search for “latte”, switch category filters, and open a drink to see price, estimated calories, availability, and customization.
3. **Smart Picks:** Change flavor, temperature, goal, and city in the Smart Picks strip. Recommendations and reasons update. Disconnect the browser or block Open-Meteo to see the honest weather fallback.
4. **Customization:** Change strength, milk, temperature, syrup, and shots. Totals and calories update immediately. Sign in as the customer and save a named recipe.
5. **Personal recipes:** Open My recipes, then edit, delete (with confirmation), or Order again. Inventory is checked again when reordering.
6. **Cart and order:** Add both saved and unsaved drinks. Adjust quantity, remove lines, and verify that stock is not consumed before payment.
7. **Payment:** Continue to payment and select any simulated method. Choose `Declined` to demonstrate the no-stock-change path; choose `Approved` to complete one demo brew and deduct stock once.
8. **Receipts:** After approval, choose QR code to generate a real QR image, Email for validated simulated delivery confirmation, No receipt to skip, or Print receipt for the browser print dialog.
9. **Technician role:** Sign out, choose Tech access, and use the technician credentials. Invalid attempts never grant access; successful sign-in reveals the protected Technician console.
10. **Technician console:** Refill or correct inventory and observe logs. In Maintenance, use “Simulate bin near capacity” to lock customer checkout, then empty the grounds bin. Run a diagnostic. In Logs, filter by severity or search text and clear filters.

## Structure and architecture

- `src/App.tsx` owns the browser UI state and sequential customer/service screens. It calls the domain and persistence helpers rather than duplicating business rules in the controls.
- `src/domain.ts` contains pure rules for prices, calorie estimates, stock requirements, shortages, deductions, recommendations, and logs. These rules are covered by `src/domain.test.ts`.
- `src/data.ts` contains the seeded drink programs, inventory, machine status, and initial diagnostic events.
- `src/storage.ts` provides versioned localStorage persistence and the reset-to-seed operation.
- `src/receipts.ts` creates QR data URLs for completed simulated orders.
- `src/styles.css` defines the appliance casing, inset display, responsive control-panel layout, accessible focus states, and status tokens.

The main operation is deliberately sequential: READY/menu, customer access when needed, drink configuration, order review, simulated payment, completed demo brew, and receipt choice. The step rail is informational and cannot bypass validation. Technician controls are rendered only for the authenticated technician role and are still guarded in the technician view.

## Data reset and limitations

Use **Reset demo data** in the footer to restore seeded inventory, preferences, orders, machine status, and logs after confirmation. All mutable state is stored in versioned browser localStorage (`smartbrew-v1`); it is not secure authentication storage.

This is a coursework prototype: customer and technician authentication are front-end-only, payment is simulated, email is not sent, no physical machine is connected, recommendations use deterministic preferences/history/weather rules rather than a deployed LLM, and natural-language ordering is visibly marked **Coming Soon**. There is no camera, facial analysis, NFC, card scanning, or standalone offline mode. Inventory, logs, maintenance actions, and receipts are demonstration data stored in the browser and are not an equipment telemetry system.

## Troubleshooting

- **Node version mismatch:** install Node 20.19+ or 22.12+, reopen the terminal, and run `npm install` again.
- **`npm install` fails:** remove only the generated `node_modules` folder and rerun `npm install`; check network access.
- **Weather does not load:** this is expected when the public API or network is unavailable; the app continues with preference and order-history recommendations.
- **Stale demo state:** use Reset demo data in the footer, or clear the browser's site data/localStorage for the Vite origin.
