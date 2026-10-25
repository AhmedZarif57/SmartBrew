# SmartBrew

SmartBrew is a browser-demonstrated UI prototype for a retro smart beverage-brewing machine. The browser is the presentation and demonstration environment; SmartBrew is not an online coffee shop or production e-commerce service. Customer and technician workflows are represented on the simulated machine screen.

Customers can browse, customize, save, and order drinks. Technicians can sign in to maintain the simulated station. Authentication, payment, brewing, email delivery, inventory, logs, and receipts are demonstrations stored in the browser. The only external request is an optional weather request to Open-Meteo; QR images are generated locally by the `qrcode` package. No payment processor, email provider, hardware, database, or LLM is called.

## Implemented functionalities

1. **Customer authentication and guest access** - seeded customer sign-in, sign-out, three-attempt guest fallback, and guest ordering.
2. **Menu and availability** - searchable, category-filtered drink catalogue with stock and maintenance availability feedback.
3. **Recommendations** - deterministic Smart Picks using taste, temperature, calorie goal, available inventory, optional current weather, and a stable catalogue order.
4. **Recommendation preferences** - customer preference controls for taste, temperature, and calorie goal, persisted in localStorage.
5. **Customization and ingredient validation** - strength, temperature, milk, syrup, and shots affect price/calories; stock is checked before cart addition and again at payment.
6. **Saved customer recipes** - customer-only named recipes can be saved, edited, deleted, and reordered.
7. **Order creation and review** - customized and unsaved menu drinks can be added, quantities changed, and reviewed before payment.
8. **Checkout, payment, and receipts** - payment outcome is simulated; approval deducts stock once, decline does not. QR generation is local, email is only a confirmation simulation, and print uses the browser dialog.
9. **Technician authentication and role restriction** - technician credentials reveal the protected service console; customer and guest roles cannot execute service actions.
10. **Technician operations** - refill/correct inventory, simulate and clear maintenance state, run diagnostics, and filter/search system logs.

Natural-language ordering is **Coming Soon / not implemented with a working LLM**. The visible control deliberately explains that manual configuration is currently required.

## Environment and prerequisites

- Node.js 20 LTS is recommended (Node.js 18+ is compatible with Vite 6; Node 20 or 22 is the supported coursework choice).
- npm is included with Node.js.
- A current Chrome, Edge, Firefox, or Safari browser is assumed.
- React 18, React DOM 18, TypeScript 5, Vite 6, Vitest 5, and `qrcode` are the important libraries.
- Open-Meteo is requested from the browser for weather recommendations. If it is unavailable, recommendations continue without weather.
- No environment variables are required. Do not add credentials to this repository.

## Installation and setup

Clone or download the repository, then run:

```bash
git clone https://github.com/AhmedZarif57/SmartBrew.git
cd SmartBrew
npm ci
```

`npm ci` uses the committed `package-lock.json` to reproduce the dependency tree. Use `npm install` when intentionally updating dependencies. Local `.env` files are ignored; no `.env.example` is needed because this prototype has no configurable secrets.

## Execution guide

```bash
npm run dev
npm test
npm run build
```

Open the local URL printed by Vite, normally `http://localhost:5173/`. `npm test` runs the Vitest suite. `npm run build` runs TypeScript project checks and produces the browser bundle in `dist/`; that bundle is the compiled demonstration, not a backend or machine controller.

## Demo credentials

These are public demo-only credentials seeded by the application:

- Customer: `customer@smartbrew.demo` / `brew123`
- Technician: `tech@smartbrew.demo` / `Tech123!`

## Demonstrate and test the ten functionalities

1. **Authentication and guest access:** Choose Customer sign in, use the customer credentials, sign out, then submit three wrong passwords. Verify guest mode is enabled and private recipe management remains unavailable.
2. **Menu and availability:** Search `latte`, select category filters, and open a drink. Verify price, calories, and unavailable stock messaging. Use the technician flow to refill stock if needed.
3. **Recommendations:** Change Smart Picks taste, temperature, calorie goal, and city. Verify three recommendations and reasons. Block the weather request or disconnect the network to verify the preference-only fallback.
4. **Preferences:** Sign in, change the Smart Picks controls, reload the page, and verify the choices persist in browser localStorage.
5. **Customization:** Configure milk, strength, syrup, and shots. Verify totals and calories change and that an unavailable recipe cannot be added.
6. **Saved recipes:** As the customer, save a named configuration, open My recipes, edit/delete it, and use Order again. Verify reordering rechecks inventory.
7. **Orders:** Add a configured drink, open Order review, change quantity, and verify the total. Confirm stock is not deducted before payment.
8. **Payment and receipts:** Select payment, try Declined and verify no stock change, then Approved and verify one deduction. Choose QR, Email, No receipt, or Print receipt. QR generation and email are simulated/local behaviours.
9. **Technician access:** Sign out, choose Technician / service, and use technician credentials. Verify invalid attempts never expose the console and valid access shows Service console.
10. **Technician operations:** Refill or correct inventory, simulate a near-capacity grounds bin, clear it, run diagnostics, and filter/search Logs. Verify actions produce log entries and maintenance lock prevents customer checkout.

Manual browser checks are required for visual layout, dialogs, browser printing, localStorage reset, and the live/fallback weather request; these are not covered by the unit tests.

## Known limitations

This is a front-end coursework demonstration. There is no physical machine, real brewing, secure authentication, server persistence, payment capability, email delivery, or equipment telemetry. Credentials and state are browser-local and not secure. Recommendations are deterministic rules, not an LLM. Weather depends on a public browser request and has a fallback. QR output encodes a simulated receipt. Facial-expression analysis, camera/NFC/card scanning, and a separate offline feature are not implemented.

## Project structure

See [PROJECT_FILE_MAP.md](./PROJECT_FILE_MAP.md) for verified feature-to-code traceability and execution paths. See [FEATURES_AND_ACCEPTANCE.md](./FEATURES_AND_ACCEPTANCE.md) for reviewer-oriented acceptance checklists.

- [src/App.tsx](./src/App.tsx): single-page UI state, customer workflow, checkout, receipts, and technician console.
- [src/domain.ts](./src/domain.ts): pure pricing, calories, inventory, recommendations, and logging rules.
- [src/data.ts](./src/data.ts): catalogue and seeded machine data.
- [src/storage.ts](./src/storage.ts): localStorage seed/load/save/reset.
- [src/receipts.ts](./src/receipts.ts): local QR data URL generation.
- [src/domain.test.ts](./src/domain.test.ts): Vitest domain coverage.
- [src/styles.css](./src/styles.css): retro machine-screen styling and responsive layout.

## Troubleshooting

- If Node is rejected, install Node 20 LTS or another Node 18+ release and reopen the terminal.
- If dependencies are missing, run `npm ci` from the repository root.
- If weather is unavailable, this is an expected fallback; the rest of Smart Picks remains usable.
- If old demo data is confusing, use **Reset demo data** in the footer or clear localStorage for the Vite origin.
- If a port is busy, use the URL Vite prints after it selects another port.

## Project status and verification

The repository currently includes one automated Vitest file with six passing tests. The checks run for this audit were:

- `npm test` - passed: 1 test file, 6 tests.
- `npm run build` - passed: TypeScript check and Vite production build generated `dist/`.

The earlier exploratory command `npm test -- --runInBand` was not used as a result because Vitest does not support that Jest option.
