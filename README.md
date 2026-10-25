# SmartBrew

SmartBrew is a browser-based React/Vite prototype of a smart beverage-brewing machine. It demonstrates customer ordering, drink customization, recommendations, simulated checkout and receipts, and technician service workflows.

This is a demonstration only. It has no real payment processing, email delivery, hardware control, database, secure authentication, or physical brewing.

## Prerequisites

Install these before starting:

- **Node.js 20 LTS** (Node.js 18 or newer is also compatible).
- **npm**, included with Node.js.
- A current **Chrome, Edge, Firefox, or Safari** browser.
- Git, if cloning the repository.

Check the installed versions:

```bash
node --version
npm --version
```

No environment variables, API keys, or `.env` files are required.

## Installation

Clone the repository and enter its folder:

```bash
git clone https://github.com/AhmedZarif57/SmartBrew.git
cd SmartBrew
```

Install the exact dependency versions recorded in the lockfile:

```bash
npm ci
```

Use `npm install` only when you intentionally want to update dependencies.

### Windows

Run the commands in PowerShell, Command Prompt, or the VS Code terminal. If PowerShell blocks `npm` with a message about script execution, use Command Prompt or run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Close and reopen the terminal, then retry the command. If Windows reports **Access is denied**, close programs using the repository, confirm your user can write to the project folder, and retry. Use an Administrator terminal only when the error is specifically caused by Windows permissions. Do not use `sudo` on Windows.

### macOS and Linux

Run the same commands in Terminal. If npm reports a permission error, do not run the project with `sudo`. Install Node.js through a version manager such as `nvm`, or fix ownership of your npm cache and project directory, then run `npm ci` again.

## Run the application

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, normally `http://localhost:5173/`. Keep the terminal open while using the application. Stop the server with `Ctrl+C`.

Run the automated tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

The build checks TypeScript and writes the browser bundle to `dist/`.

## Demo accounts

These credentials are public and for demonstration only:

- **Customer:** `customer@smartbrew.demo` / `brew123`
- **Technician:** `tech@smartbrew.demo` / `Tech123!`

## Where to look

| Need | File |
| --- | --- |
| Main UI, customer flow, checkout, receipts, and technician console | [`src/App.tsx`](./src/App.tsx) |
| Pricing, calories, inventory, recommendations, and logs | [`src/domain.ts`](./src/domain.ts) |
| Drinks and initial machine data | [`src/data.ts`](./src/data.ts) |
| Shared TypeScript types | [`src/types.ts`](./src/types.ts) |
| Browser localStorage persistence and reset | [`src/storage.ts`](./src/storage.ts) |
| Local QR receipt generation | [`src/receipts.ts`](./src/receipts.ts) |
| React entry point | [`src/main.tsx`](./src/main.tsx) |
| Layout and responsive styling | [`src/styles.css`](./src/styles.css) |
| Automated domain tests | [`src/domain.test.ts`](./src/domain.test.ts) |
| npm scripts and dependencies | [`package.json`](./package.json) |
| Vite configuration | [`vite.config.ts`](./vite.config.ts) |
| Full feature traceability | [`PROJECT_FILE_MAP.md`](./PROJECT_FILE_MAP.md) |
| Acceptance checklist | [`FEATURES_AND_ACCEPTANCE.md`](./FEATURES_AND_ACCEPTANCE.md) |

## Troubleshooting

- **`npm ci` fails or dependencies are missing:** Run it from the repository root and confirm Node.js is version 18 or newer.
- **Windows says scripts are disabled:** Use Command Prompt, use `npm.cmd`, or apply the PowerShell fix in the Windows section above.
- **Windows says Access is denied:** Close running dev servers and editors using the folder, check folder write access, and retry. Avoid installing dependencies with `sudo`-style workarounds.
- **macOS/Linux says `EACCES` or permission denied:** Use `nvm` or correct ownership of the npm cache/project; avoid `sudo npm install`.
- **The port is busy:** Use the alternative URL printed by Vite, or stop the process using the port and run `npm run dev` again.
- **Weather recommendations do not load:** This is expected when Open-Meteo is unavailable. Smart Picks continue using local preferences and inventory.
- **Old demo data appears:** Select **Reset demo data** in the application, or clear localStorage for the local Vite URL.
- **The browser page is blank:** Check the terminal for build errors, stop the server, run `npm ci`, then run `npm run dev` again.

## Scope and limitations

All authentication, orders, inventory, preferences, logs, receipts, and technician actions are simulated or stored in the browser. The optional weather request uses Open-Meteo; QR images are generated locally. Natural-language ordering is displayed as **Coming Soon** and is not implemented.
