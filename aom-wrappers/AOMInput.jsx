/**
 * AOMInput — wraps any input/textarea/select.
 * The AOM parser extracts ONLY elements wrapped in this component.
 *
 * @prop {string}  id          - Stable dot-notation input ID  e.g. "auth.email_field"
 * @prop {string}  description - Human/agent-readable description
 * @prop {string}  [inputType="text"] - "text" | "email" | "password" | "search" | "textarea"
 * @prop {object}  [schema]    - Optional JSON schema for the expected value
 * @prop {string}  [permission="user"]
 * @prop {string}  [group]
 */
export default function AOMInput({
    id,
    description,
    inputType = 'text',
    schema,
    permission = 'user',
    group,
    children,
}) {
    // Runtime: pure passthrough — zero visual impact, zero bundle overhead
    return children;
}
