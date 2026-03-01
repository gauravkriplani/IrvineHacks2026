# Agent Capability Extraction Pipeline (AOM)

## 1. Overview

Build a CI/CD-integrated system that parses application source code and generates a structured `agent-surface.json` file. This file represents the machine-readable capability layer of the application for AI agents.

The system must avoid modifying runtime application code and instead produce a separate, versioned artifact deployed alongside the app.

---

## 2. Core Objectives

* Extract interactive components from source files
* Generate a deterministic, structured capability contract
* Minimize AI reasoning surface area
* Enable deterministic execution via action mapping
* Support iterative schema evolution

---

## 3. Functional Requirements

### 3.1 Source Parsing

* Parse all files under `src/` (.js, .ts, .jsx, .tsx)
* Use AST-based analysis (Babel, SWC, or TypeScript Compiler API)
* Detect interactive elements:

  * button
  * input
  * textarea
  * select
  * anchor (links)
  * custom components with onClick/onChange handlers
* Extract:

  * tag/type
  * handler name
  * file path
  * component name
  * aria attributes
  * href (if applicable)

---

### 3.2 AI Semantic Enhancement (Prompt-Based)

* Generate semantic `action_id`
* Infer action description
* Propose input schema (if applicable)
* Assign permission level
* Assign safety_score
* Group related actions
* Output must be strict JSON

---

### 3.3 Output Artifact

Generate `agent-surface.json` with structure:

```json
{
  "version": "1.0",
  "base_url": "",
  "actions": [
    {
      "action_id": "checkout.submit",
      "component": "CheckoutButton",
      "file": "src/components/Checkout.tsx",
      "tag": "button",
      "handler": "handleSubmit",
      "description": "Submits checkout form",
      "input_schema": {},
      "permission": "user",
      "safety_score": 0.2
    }
  ]
}
```

Requirements:

* Deterministic ordering
* Stable action IDs
* JSON schema validation
* Versioned output

---

## 4. System Architecture

The implemented Agent Object Model (AOM) system consists of three interconnected layers:

### 4.1 AOM Wrappers (Runtime)
React components (`AOMAction`, `AOMInput`, `AOMLink`) that wrap existing interactive elements in the application. They:
- Register themselves with the global `AOMRegistry` on component mount.
- Unregister on component unmount to keep the agent's view perfectly synced with the DOM.
- Expose deterministic `action_id` references (e.g., `checkout.submit_order`).

### 4.2 AOM Registry (Global State)
A strict singleton exposed on `window.__AOM__` that serves as the bridge between the UI and the Agent.
- Maintains a live dictionary of all available interactive elements.
- Provides methods for agents to interact: `execute(id)`, `fill(id, value)`, `navigate(id)`.
- Replaces brittle DOM querying with guaranteed JavaScript event execution.

### 4.3 Agent Dashboard & LLM Chat Integration
A sidebar dashboard injected into target applications (e.g., `@demo-amazon`) to visualize and test agent capabilities.
- Displays the live, dynamic `agentState` JSON.
- Features a Natural Language Chat Interface powered by Groq's `llama-3.3-70b-versatile` model.
- Automatically translates plain English requests (e.g., "Add airpods to cart") into deterministic AOM commands (e.g., `window.__AOM__.execute('product.1.add_to_cart')`).
- Securely pulls API keys from a local `.env` file (`VITE_GROQ_KEY`) to bypass interactive configuration.
- **Multi-Step Memory Loop:** Supports autonomous, multi-step navigation. The agent fetches the UI state, predicts a step, executes it, waits for the DOM to update, and dynamically re-prompts itself with the new UI state until the task is marked completed (`task_completed: true`). Does not require single-shot DOM generation.

---

## 5. Execution Model

The system supports deterministic execution via mapping:

`action_id` → `AOMRegistry` → Original React Component Handler

Execution guarantees:
- **No DOM-based automation:** Agents do not need CSS selectors or x/y coordinates.
- **Instantaneous state:** The registry updates immediately during React lifecycles.
- **Reduced Hallucinations:** The LLM is provided a strict menu of exactly what is possible on the screen at that exact millisecond.

---

## 6. Success Criteria & Results

- **Complete Decoupling:** Agents can operate using only the subset of data provided by the AOM layer.
- **Massive Prompt Reduction:** 10x–100x reduction in prompt size compared to feeding raw DOM HTML into an LLM.
- **Resilience:** Changes to CSS classes, div structures, and virtualized lists no longer break agent scripts. As long as the `action_id` remains stable, the agent functions perfectly.
