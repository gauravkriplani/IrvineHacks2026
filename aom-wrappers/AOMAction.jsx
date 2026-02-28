/**
 * AOMAction — wraps any clickable/interactive element.
 * The AOM parser extracts ONLY elements wrapped in this component.
 *
 * @prop {string}  id          - Stable dot-notation action ID  e.g. "feed.like_post"
 * @prop {string}  description - Human/agent-readable description of what this does
 * @prop {string}  [permission="user"] - "public" | "user" | "admin"
 * @prop {number}  [safety=0.9]        - Reversibility score 0 (destructive) → 1 (safe)
 * @prop {string}  [group]     - Optional group label e.g. "feed", "auth"
 */
export default function AOMAction({
    id,
    description,
    permission = 'user',
    safety = 0.9,
    group,
    children,
}) {
    // Runtime: pure passthrough — zero visual impact, zero bundle overhead
    return children;
}
