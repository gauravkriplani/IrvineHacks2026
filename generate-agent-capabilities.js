import OpenAI from "openai"
import { glob } from "glob"
import fs from "fs-extra"
import Ajv from "ajv"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// -------- JSON Schema Validation --------
const schema = {
  type: "object",
  properties: {
    version: { type: "string" },
    actions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          action_id: { type: "string" },
          file: { type: "string" },
          component: { type: "string" },
          tag: { type: "string" },
          handler: { type: "string" },
          description: { type: "string" }
        },
        required: ["action_id", "file", "tag", "description"]
      }
    }
  },
  required: ["version", "actions"]
}

const ajv = new Ajv()
const validate = ajv.compile(schema)

// -------- Read Source Files --------
async function readSourceFiles() {
  const files = await glob("src/**/*.{js,ts,jsx,tsx}", {
    ignore: ["**/*.test.*", "**/*.spec.*", "**/node_modules/**"]
  })

  let combined = ""

  for (const file of files) {
    const content = await fs.readFile(file, "utf8")
    combined += `\n\n// FILE: ${file}\n${content}`
  }

  // Prevent massive token overflow (hackathon safety)
  if (combined.length > 120000) {
    combined = combined.slice(0, 120000)
  }

  return combined
}

// -------- Main --------
async function generate() {
  console.log("Reading source files...")
  const sourceCode = await readSourceFiles()

  console.log("Sending to OpenAI...")

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
You are an AOM (Agentic Object Model) compiler.

You analyze React/Next.js source code and extract a deterministic machine-readable capability contract.

Rules:
- Return STRICT valid JSON.
- Return JSON only.
- Do not include markdown.
- Do not include commentary.
- Do not hallucinate files or handlers.
- If unsure, omit the action.
`
      },
      {
        role: "user",
        content: `
Analyze the following project source code and generate an AOM contract.

Extraction Rules:

1. Detect interactive elements:
   - <button>
   - <input>
   - <textarea>
   - <select>
   - <a> with href
   - JSX elements with onClick, onChange, onSubmit, onKeyDown

2. An action must represent a user-triggered event.
3. Ignore presentational elements (div, span without handlers).
4. Extract:
   - action_id (semantic, lowercase dot notation if possible)
   - file (exact file path from comment markers)
   - component (React component name if identifiable)
   - tag (button, input, custom component name)
   - handler (function name or "inline_handler")
   - description (1 short sentence describing the action)

Output exactly:

{
  "version": "1.0",
  "actions": [
    {
      "action_id": "string",
      "file": "string",
      "component": "string",
      "tag": "string",
      "handler": "string",
      "description": "string"
    }
  ]
}

Source Code:
${sourceCode}
`
      }
    ],
    max_tokens: 2000
  })

  const json = response.choices[0].message.parsed || JSON.parse(response.choices[0].message.content)

  if (!validate(json)) {
    console.error("❌ JSON failed schema validation")
    console.log(validate.errors)
    return
  }

  await fs.writeFile("agent-contract.json", JSON.stringify(json, null, 2))
  console.log("✅ agent-contract.json generated successfully")
}

generate()