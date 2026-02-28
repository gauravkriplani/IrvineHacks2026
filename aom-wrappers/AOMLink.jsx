/**
 * AOMLink — wraps any navigation element (<a>, <Link>, etc).
 *
 * At parse time: the AST parser extracts props into agent-surface.json.
 * At runtime: injects data attributes + registers with AOMRegistry for
 *             programmatic navigation via window.__AOM__.navigate(id).
 *
 * @prop {string}  id          - Stable dot-notation link ID  e.g. "nav.go_to_profile"
 * @prop {string}  description - Human/agent-readable description
 * @prop {string}  destination - Human label for the target e.g. "Profile page"
 * @prop {string}  [permission="public"]
 * @prop {string}  [group]
 */
import { useRef, useEffect, cloneElement, Children } from 'react';
import AOMRegistry from './AOMRegistry';

export default function AOMLink({
    id,
    description,
    destination,
    permission = 'public',
    group,
    children,
}) {
    const ref = useRef(null);

    useEffect(() => {
        if (!id || !ref.current) return;
        AOMRegistry.register(id, {
            kind: 'link',
            description,
            destination,
            permission,
            group,
            element: ref.current,
        });
        return () => AOMRegistry.unregister(id);
    }, [id, description, destination, permission, group]);

    const child = Children.only(children);
    return cloneElement(child, {
        ref,
        'data-aom-id': id,
        'data-aom-kind': 'link',
        'data-aom-description': description,
    });
}
