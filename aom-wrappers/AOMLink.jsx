/**
 * AOMLink — wraps any navigation element (<a>, <Link>, etc).
 * The AOM parser extracts ONLY elements wrapped in this component.
 *
 * @prop {string}  id          - Stable dot-notation link ID  e.g. "nav.go_to_profile"
 * @prop {string}  description - Human/agent-readable description
 * @prop {string}  destination - Human label for the target e.g. "Profile page"
 * @prop {string}  [permission="public"]
 * @prop {string}  [group]
 */
export default function AOMLink({
    id,
    description,
    destination,
    permission = 'public',
    group,
    children,
}) {
    // Runtime: pure passthrough — zero visual impact, zero bundle overhead
    return children;
}
