/**
 * AOMInput — wraps any input/textarea/select.
 *
 * At parse time: the AST parser extracts props into agent-surface.json.
 * At runtime: injects data attributes + registers with AOMRegistry for
 *             programmatic value setting via window.__AOM__.fill(id, value).
 *
 * @prop {string}  id          - Stable dot-notation input ID  e.g. "auth.email_field"
 * @prop {string}  description - Human/agent-readable description
 * @prop {string}  [inputType="text"] - "text" | "email" | "password" | "search" | "textarea"
 * @prop {string}  [permission="user"]
 * @prop {string}  [group]
 */
import { useRef, useEffect, cloneElement, Children } from 'react';
import AOMRegistry from './AOMRegistry';

export default function AOMInput({
    id,
    description,
    inputType = 'text',
    permission = 'user',
    needsReview = false,
    group,
    children,
}) {
    const ref = useRef(null);

    useEffect(() => {
        if (!id || !ref.current) return;
        AOMRegistry.register(id, {
            kind: 'input',
            description,
            inputType,
            permission,
            needsReview,
            group,
            element: ref.current,
        });
        return () => AOMRegistry.unregister(id);
    }, [id, description, inputType, permission, needsReview, group]);

    const child = Children.only(children);
    return cloneElement(child, {
        ref,
        'data-aom-id': id,
        'data-aom-kind': 'input',
        'data-aom-description': description,
    });
}
