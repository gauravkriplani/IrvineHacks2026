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

## 4. Execution Model

The system must support deterministic execution via mapping:

`action_id` → runtime handler OR API endpoint

Execution must:

* Avoid DOM-based automation
* Support direct invocation
* Support permission enforcement
* Be auditable/loggable

---

## 5. CI/CD Integration

* Runs during build step
* Regenerates `agent-surface.json`
* Fails build on schema validation errors
* Optionally produces diff report
* Outputs artifact to deploy directory

---

## 6. Non-Functional Requirements

* No runtime bundle size increase
* No modification of application logic
* Deterministic output
* Scalable to large codebases
* Compatible with modern React/Next.js apps

---

## 7. Future Extensions

* Capability graph visualization
* Action dependency mapping
* Concurrency modeling
* Role-based permission matrix
* Safety policy engine
* Replay/audit logging

---

## 8. Out of Scope (V1)

* Runtime wrapper injection
* Fine-tuned AI models
* Vision-based UI parsing
* Cross-framework universal support

---

## 9. Success Criteria

* Agent can operate using only `agent-surface.json`
* 10x–100x reduction in prompt size compared to DOM parsing
* Deterministic execution path
* Stable artifact across builds
