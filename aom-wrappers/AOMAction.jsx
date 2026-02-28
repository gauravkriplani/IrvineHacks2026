/**
 * AOMAction — wraps any clickable/interactive element.
 *
 * At parse time: the AST parser extracts props into agent-surface.json.
 * At runtime: injects data attributes + registers with AOMRegistry for
 *             programmatic execution via window.__AOM__.execute(id).
 *
 * @prop {string}  id          - Stable dot-notation action ID  e.g. "feed.like_post"
 * @prop {string}  description - Human/agent-readable description of what this does
 * @prop {string}  [permission="user"] - "public" | "user" | "admin"
 * @prop {number}  [safety=0.9]        - Reversibility score 0 (destructive) → 1 (safe)
 * @prop {string}  [group]     - Optional group label e.g. "feed", "auth"
 */
import { useRef, useEffect, cloneElement, Children } from 'react';
import AOMRegistry from './AOMRegistry';

export default function AOMAction({
    id,
    description,
    permission = 'user',
    safety = 0.9,
    group,
    children,
}) {
    const ref = useRef(null);

    useEffect(() => {
        if (!id || !ref.current) return;
        AOMRegistry.register(id, {
            kind: 'action',
            description,
            permission,
            safety,
            group,
            element: ref.current,
        });
        return () => AOMRegistry.unregister(id);
    }, [id, description, permission, safety, group]);

    const child = Children.only(children);
    return cloneElement(child, {
        ref,
        'data-aom-id': id,
        'data-aom-kind': 'action',
        'data-aom-description': description,
    });
}
