# AOM Hackathon Prototype

This project generates an **Agent Contract (AOM)** from a website codebase.

It analyzes all source files in `src/` and produces a structured machine-readable capability file: `agent-contract.json`.

---

## 🚀 Setup

### 1. Install Dependencies

If starting fresh:

```bash
npm init -y
npm install openai ajv glob fs-extra
```

---

## 🔑 Set Your OpenAI API Key

### Mac / Linux

```bash
export OPENAI_API_KEY="your_api_key_here"
```

### Windows (PowerShell)

```powershell
setx OPENAI_API_KEY "your_api_key_here"
```

Restart your terminal after setting the key.

---

## ▶️ Run the Generator

Make sure you have a `src/` folder containing your website code.

Then run:

```bash
node generate-agent-contract.js
```

If successful, you will see:

```
✅ agent-contract.json generated successfully
```

---

## 📦 What This Does

1. Reads all source files under `src/`
2. Sends them to OpenAI
3. Extracts interactive UI components
4. Converts them into structured actions
5. Generates `agent-contract.json`

Instead of forcing an AI agent to parse the DOM or full codebase, the agent only reads this small, structured contract file.