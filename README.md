# AOM (Agentic Object Model) — IrvineHacks 2026

A system that gives AI agents a structured, deterministic map of what a web app can do — without parsing the DOM or dumping entire codebases into a prompt.

---

## How It Works

Developers wrap interactive elements with **AOM components**. A parser scans the source and extracts *only* those wrapped elements into a machine-readable contract.

```
Developer annotates JSX with <AOMAction> / <AOMInput> / <AOMLink>
              ↓
    node parse-aom.js --src ./my-app/src
              ↓
    aom-output/agent-surface.json   ← full contract
    aom-output/ai-pages/*.txt       ← one file per page
```

No AI needed to parse — fully deterministic.

---

## Repo Structure

```
IrvineHacks2026/
├── aom-wrappers/              # Standalone AOM wrapper components
│   ├── AOMAction.jsx          # Wraps buttons / clickables
│   ├── AOMInput.jsx           # Wraps inputs / textareas
│   ├── AOMLink.jsx            # Wraps navigation links
│   └── index.js
│
├── dummy-website/             # Demo Instagram clone (test target)
│   └── src/
│       ├── with-custom-components/    # React + Vite version
│       └── without-custom-components/ # Plain HTML/CSS/JS version
│
├── parse-aom.js               # AST parser — extracts AOM wrappers
├── generate-agent-capabilities.js  # (Legacy) AI-based extractor
└── aom-output/                # Generated output — gitignored
    ├── agent-surface.json
    └── ai-pages/
```

---

## AOM Wrapper Components

Import from `aom-wrappers/` and wrap any interactive element:

```jsx
import { AOMAction, AOMInput, AOMLink } from '../../aom-wrappers';

// Button
<AOMAction id="feed.like_post" description="Like a post" permission="user" safety={0.9}>
  <button onClick={handleLike}>❤</button>
</AOMAction>

// Input
<AOMInput id="auth.email_field" description="Email login field" inputType="email">
  <input type="email" />
</AOMInput>

// Link
<AOMLink id="auth.go_to_signup" description="Navigate to sign-up page" destination="Sign up page">
  <Link to="/signup">Sign up</Link>
</AOMLink>
```

All three are **zero-overhead at runtime** — pure passthroughs that return `children` unchanged.

### Props

| Prop | Components | Description |
|---|---|---|
| `id` | All | Stable dot-notation ID e.g. `"feed.like_post"` |
| `description` | All | Human/agent-readable description |
| `permission` | All | `"public"` \| `"user"` \| `"admin"` |
| `safety` | AOMAction | Reversibility score `0` (destructive) → `1` (safe) |
| `inputType` | AOMInput | `"text"` \| `"email"` \| `"password"` \| `"search"` |
| `destination` | AOMLink | Human label for the target page |
| `group` | All | Optional group label e.g. `"auth"`, `"feed"` |

---

## Running the Parser

```bash
# Install deps (first time only)
npm install

# Parse any React app's src directory
node parse-aom.js --src ./dummy-website/src/with-custom-components/src

# Output appears in aom-output/
```

### Output: `agent-surface.json`

```json
{
  "version": "1.0",
  "total_actions": 16,
  "actions": [
    {
      "action_id": "auth.submit_login",
      "kind": "action",
      "component": "LoginPage",
      "file": "dummy-website/src/.../LoginPage.jsx",
      "description": "Submit login credentials to authenticate the user",
      "permission": "public",
      "safety_score": 0.9,
      "group": "auth"
    }
  ]
}
```

### Output: `aom-output/ai-pages/LoginPage.txt`

```
# AOM Surface — LoginPage
Actions: 6

## auth.submit_login
Kind:        action
Description: Submit login credentials to authenticate the user
Permission:  public
Safety:      0.9
Group:       auth
```

---

## Demo Website

The `dummy-website/` folder contains a full Instagram clone used as a test target:

- **`with-custom-components/`** — React + Vite app with 9 custom components and 9 pages
- **`without-custom-components/`** — Identical copy (no custom components)

```bash
# Run the React version
cd dummy-website/src/with-custom-components
npm install && npm run dev
```

---

## Legacy: AI-Based Generator

`generate-agent-capabilities.js` sends the entire source to OpenAI. The new `parse-aom.js` is preferred — it's deterministic, faster, and uses no tokens.

```bash
export OPENAI_API_KEY="your_key"
npm run generate
```