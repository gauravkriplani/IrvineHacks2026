# Agent Native — AOM (Agentic Object Model)

> Built at **IrvineHacks 2026** by Maan Patel, Gaurav Kriplani, Aditya Jain, and Justin Siek — UC Irvine

Agent Native gives AI agents a structured, deterministic map of what a web app can do — without parsing the DOM, scraping HTML, or dumping entire codebases into a prompt.

Upload a ZIP of your React source → get back `.aom.js` wrapper files that expose every interactive element as a machine-readable action manifest. No AI required to parse; fully deterministic Babel AST analysis.

---

## Quick Start (3 Commands)

```bash
# 1 — Clone the repo
git clone https://github.com/gauravkriplani/IrvineHacks2026.git && cd IrvineHacks2026

# 2 — Install all dependencies (root server deps + frontend UI deps)
npm install

# 3 — Start the backend server and the frontend UI together
npm start
```

- **Frontend UI** → [http://localhost:5173](http://localhost:5173)
- **Backend API** → [http://localhost:4000](http://localhost:4000)

`npm install` automatically runs `npm install --prefix aom-ui` via a `postinstall` script, so one command installs everything. `npm start` uses `concurrently` to launch both processes in the same terminal.

---

## What Is AOM?

The **Agentic Object Model** is a lightweight contract that describes every interactive element in a React app — buttons, inputs, links — as a structured action object. It is analogous to what the DOM is to browsers, but designed for AI agents instead of rendering engines.

Each action in the manifest describes:

| Field           | Description                                               |
| --------------- | --------------------------------------------------------- |
| `action_id`     | Stable unique ID scoped to the file and element           |
| `file`          | Source file path relative to the uploaded ZIP             |
| `component`     | React component name the element belongs to               |
| `tag`           | JSX tag (`Button`, `input`, `a`, etc.)                    |
| `handler`       | Event handler attached (`onClick`, `onSubmit`, etc.)      |
| `description`   | Human/agent-readable description of the action            |
| `needs_review`  | `true` if the element is flagged as high-risk (see below) |
| `metadata.line` | Source line number                                        |

---

## How It Works

```
User uploads a ZIP of their React src/
              ↓
POST /api/generate-aom  (Express server, port 4000)
              ↓
Babel AST parser scans every .jsx / .tsx / .js file
              ↓
Extracts all interactive elements (onClick, onSubmit, onChange …)
              ↓
Writes one  <filename>.aom.js  per source file
              ↓
Returns a ZIP of all .aom.js files for download
```

### Example Output — `Button.aom.js`

```js
export const manifest = [
  {
    action_id: "src/components/Button.jsx:a1b2c3d4",
    file: "src/components/Button.jsx",
    component: "PrimaryButton",
    tag: "button",
    handler: "onClick",
    description: "Interactive button",
    needs_review: false,
    metadata: { line: 12 },
  },
];
```

### The `needs_review` Flag

Any action is automatically flagged `needs_review: true` when the element contains signals associated with high-risk or sensitive operations, including:

- **Financial keywords** — pay, purchase, checkout, subscribe, charge, billing, refund, transfer, withdraw, donate
- **Destructive keywords** — delete, remove, destroy, permanent, cancel, deactivate, close account
- **Sensitive inputs** — credit card, CVV, SSN, bank account fields
- **High-risk handler names** — `onCheckout`, `onDelete`, `onTransfer`, `onWithdraw`, etc.

This flag lets AI agents (or human reviewers) apply extra scrutiny before executing flagged actions autonomously.

---

## Website Pages

| Route      | Page     | Description                                                                                          |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `/`        | Home     | Landing page with live demo — paste or upload source on the left, download AOM wrappers on the right |
| `/toolkit` | Product  | Full upload interface — drag & drop a ZIP, run the AOM generator, download results                   |
| `/team`    | About Us | Team profiles with GitHub and LinkedIn links                                                         |

---

## Repo Structure

```
IrvineHacks2026/
├── aom-ui/                    # React + Vite frontend (port 5173)
│   └── src/
│       ├── App.jsx            # Router — /, /toolkit, /team
│       ├── HomePage.jsx       # Landing page
│       ├── AomUploadPage.jsx  # Product / upload page
│       ├── TeamsPage.jsx      # About Us page
│       └── public/            # Images, logo, team photos
│
├── server/
│   └── generate-aom-server.js # Express API server (port 4000)
│
├── tools/
│   ├── generateAom.js         # Core Babel AST parser + needs_review logic
│   └── cli-generate-aom.js    # CLI wrapper for local use
│
├── aom-wrappers/              # Standalone JSX wrapper components
│   ├── AOMAction.jsx
│   ├── AOMInput.jsx
│   ├── AOMLink.jsx
│   └── index.js
│
├── dummy-website/             # Demo Instagram clone used as test input
│   └── src/
│       ├── with-custom-components/    # React + Vite version
│       └── without-custom-components/ # Plain HTML/CSS/JS version
│
├── demo-amazon/               # Amazon demo site
├── demo-instagram/            # Instagram demo site
├── specs/                     # Project specs and design docs
└── package.json               # Root — server deps + workspace scripts
```

---

## Backend API

### `POST /api/generate-aom`

Accepts a ZIP file of React source code and returns a ZIP of `.aom.js` wrapper files.

**Request**

```
Content-Type: multipart/form-data
Field: file  (ZIP archive of your src/ directory)
```

**Response**

```
Content-Type: application/zip
Body: ZIP containing one .aom.js file per source file
```

**Example (curl)**

```bash
curl -X POST http://localhost:4000/api/generate-aom \
  -F "file=@my-react-app.zip" \
  -o aom-wrappers.zip
```

---

## CLI Tool

Run the AOM generator directly on a local directory without the server:

```bash
node tools/cli-generate-aom.js --src ./my-app/src --out ./aom-output
```

---

## AOM Wrapper Components

The `aom-wrappers/` package contains zero-overhead JSX components for manually annotating interactive elements. These are pure passthroughs at runtime — they return `children` unchanged.

```jsx
import { AOMAction, AOMInput, AOMLink } from './aom-wrappers';

<AOMAction id="feed.like_post" description="Like a post" permission="user" safety={0.9}>
  <button onClick={handleLike}>❤</button>
</AOMAction>

<AOMInput id="auth.email_field" description="Email login field" inputType="email">
  <input type="email" />
</AOMInput>

<AOMLink id="auth.go_to_signup" description="Navigate to sign-up page" destination="Sign-up page">
  <Link to="/signup">Sign up</Link>
</AOMLink>
```

| Prop          | Components | Description                                         |
| ------------- | ---------- | --------------------------------------------------- |
| `id`          | All        | Stable dot-notation ID e.g. `"feed.like_post"`      |
| `description` | All        | Human/agent-readable description                    |
| `permission`  | All        | `"public"` \| `"user"` \| `"admin"`                 |
| `safety`      | AOMAction  | Reversibility score `0` (destructive) → `1` (safe)  |
| `inputType`   | AOMInput   | `"text"` \| `"email"` \| `"password"` \| `"search"` |
| `destination` | AOMLink    | Human label for the target page                     |
| `group`       | All        | Optional group label e.g. `"auth"`, `"feed"`        |

---

## Demo Websites

The `dummy-website/` folder contains a full Instagram clone used as a test target for the AOM generator.

- **`with-custom-components/`** — React + Vite app, 9 custom components, 9 pages
- **`without-custom-components/`** — Identical UI, plain HTML/CSS/JS

```bash
cd dummy-website/src/with-custom-components
npm install && npm run dev
```

---

## Tech Stack

| Layer       | Technology                                             |
| ----------- | ------------------------------------------------------ |
| Frontend    | React 19, Vite 7, React Router 7, Three.js             |
| Backend     | Node.js, Express 4, Multer, Archiver, Unzipper         |
| Parser      | Babel Parser, @babel/traverse                          |
| Styling     | Plain CSS (Plus Jakarta Sans, Instrument Serif, Geist) |
| Dev tooling | Concurrently, fs-extra, glob                           |
