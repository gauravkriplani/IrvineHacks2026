/**
 * AOMRegistry — Global runtime registry for AOM-wrapped components.
 *
 * Tracks every mounted AOM component and exposes an agent-facing API:
 *
 *   window.__AOM__.getActions()                  → all mounted actions
 *   window.__AOM__.get("feed.like_post")         → single entry
 *   window.__AOM__.execute("feed.like_post")     → click the element
 *   window.__AOM__.fill("auth.email", "value")   → set input value
 *   window.__AOM__.navigate("nav.profile")       → click a link
 *   window.__AOM__.getState()                    → snapshot of all entries
 */

class AOMRegistryClass {
    constructor() {
        /** @type {Map<string, object>} */
        this._entries = new Map();
        this._listeners = new Set();
    }

    // ─── Registration ────────────────────────────────────────────────

    /**
     * Register a mounted AOM component.
     * Called from wrapper useEffect hooks.
     */
    register(id, entry) {
        this._entries.set(id, entry);
        this._notify();
    }

    /**
     * Unregister an unmounted AOM component.
     * Called from wrapper useEffect cleanup.
     */
    unregister(id) {
        this._entries.delete(id);
        this._notify();
    }

    // ─── Query API ───────────────────────────────────────────────────

    /** Get all currently mounted actions */
    getActions() {
        return Array.from(this._entries.entries()).map(([id, entry]) => ({
            action_id: id,
            ...entry,
            element: undefined, // don't expose DOM refs in summary
        }));
    }

    /** Get a specific action by ID */
    get(id) {
        const entry = this._entries.get(id);
        if (!entry) return null;
        return { action_id: id, ...entry, element: undefined };
    }

    /** Check if an action exists and is mounted */
    has(id) {
        return this._entries.has(id);
    }

    /** Get a full snapshot as a plain object (for agent prompts) */
    getState() {
        const state = {};
        for (const [id, entry] of this._entries) {
            state[id] = {
                kind: entry.kind,
                description: entry.description,
                permission: entry.permission,
                enabled: entry.enabled ?? true,
                needsReview: entry.needsReview ?? false,
                ...(entry.inputType && { inputType: entry.inputType }),
                ...(entry.destination && { destination: entry.destination }),
            };
        }
        return state;
    }

    // ─── Execution API ───────────────────────────────────────────────

    /**
     * Execute an action (click a button/element).
     * @returns {boolean} true if executed, false if not found
     */
    execute(id) {
        const entry = this._entries.get(id);
        if (!entry || !entry.element) {
            console.warn(`[AOM] Action "${id}" not found or not mounted`);
            return false;
        }
        entry.element.click();
        console.log(`[AOM] Executed: ${id}`);
        return true;
    }

    /**
     * Fill an input with a value.
     * Dispatches native events so React state picks up the change.
     * @returns {boolean} true if filled, false if not found
     */
    fill(id, value) {
        const entry = this._entries.get(id);
        if (!entry || !entry.element) {
            console.warn(`[AOM] Input "${id}" not found or not mounted`);
            return false;
        }

        const el = entry.element;
        // Use native setter to bypass React's synthetic event system
        const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
        )?.set || Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 'value'
        )?.set;

        if (nativeSetter) {
            nativeSetter.call(el, value);
        } else {
            el.value = value;
        }

        // Dispatch events so React picks up the change
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));

        console.log(`[AOM] Filled: ${id} = "${value}"`);
        return true;
    }

    /**
     * Navigate via a link (click it).
     * @returns {boolean} true if navigated, false if not found
     */
    navigate(id) {
        const entry = this._entries.get(id);
        if (!entry || !entry.element) {
            console.warn(`[AOM] Link "${id}" not found or not mounted`);
            return false;
        }
        entry.element.click();
        console.log(`[AOM] Navigated: ${id}`);
        return true;
    }

    // ─── Change Listeners ────────────────────────────────────────────

    /** Subscribe to registry changes (mount/unmount events) */
    onChange(callback) {
        this._listeners.add(callback);
        return () => this._listeners.delete(callback);
    }

    /** @private Notify all listeners of a change */
    _notify() {
        for (const cb of this._listeners) {
            try { cb(this.getActions()); } catch (e) { /* ignore */ }
        }
    }
}

// Singleton — shared across the entire app.
// Prevent multiple instances if Vite evaluates this module via different paths.
const AOMRegistry = (typeof window !== 'undefined' && window.__AOM__)
    ? window.__AOM__
    : new AOMRegistryClass();

// Expose on window so agents can access from any context
if (typeof window !== 'undefined') {
    window.__AOM__ = AOMRegistry;
}

export default AOMRegistry;
