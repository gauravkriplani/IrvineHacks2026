import { useState, useEffect, useRef } from 'react';
import AOMRegistry from '../../../../aom-wrappers/AOMRegistry';
import './AgentDashboard.css';

const PROMPT = `
You are a deterministic mapping agent for a user interface.
You will be provided with a user's intent in plain english, and a JSON object representing exactly what interactive elements are currently on the screen.

Your job is to figure out the BEST sequence of elements to fulfill the user's intent, and the correct action to take on them.
If the chosen element has a \`kind\` of "input", you MUST provide what text to fill into the input. Otherwise, it is just a click.

Respond ONLY with a JSON array containing your sequence of actions, with NO OTHER TEXT. 

Example response for filling a search bar and clicking submit:
[
  {"action_id": "header.search_input", "action_type": "fill", "value": "airpods"},
  {"action_id": "header.submit_search", "action_type": "execute"}
]

Example response for just clicking a button:
[
  {"action_id": "product.5.add_to_cart", "action_type": "execute"}
]
`;

export default function AgentDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [agentState, setAgentState] = useState({});
    const [cmdInput, setCmdInput] = useState(''); // Renamed from 'command'
    const [history, setHistory] = useState([]);
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_GROQ_KEY || localStorage.getItem('__AOM_GROQ_KEY') || '');
    const [showKeyConfig, setShowKeyConfig] = useState(!import.meta.env.VITE_GROQ_KEY && !localStorage.getItem('__AOM_GROQ_KEY'));
    const [isProcessing, setIsProcessing] = useState(false);
    const historyEndRef = useRef(null);

    // Auto-scroll to bottom of history
    useEffect(() => {
        historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Keep the JSON view in sync with the live AOMRegistry
    useEffect(() => {
        const updateState = () => {
            if (window.__AOM__) {
                setAgentState(window.__AOM__.getState());
            }
        };

        // Initial state
        updateState();

        // Listen for mounts/unmounts
        const unsubscribe = window.__AOM__ ? window.__AOM__.onChange(() => {
            updateState();
        }) : () => { };

        return unsubscribe;
    }, []);

    const executeCommand = async (e) => {
        e.preventDefault();
        const cmd = cmdInput.trim();
        if (!cmd || isProcessing || !apiKey) return;

        setCmdInput('');
        setIsProcessing(true);
        setHistory(h => [...h, { type: 'user', text: cmd }]);

        try {
            const state = window.__AOM__.getState();
            const llmInput = JSON.stringify({
                user_intent: cmd,
                ui_elements: state
            }, null, 2);

            // Groq API uses exact same signature as OpenAI!
            const response = await fetch('/api/groq/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: PROMPT },
                        { role: 'user', content: llmInput }
                    ],
                    temperature: 0,
                })
            });

            let data;
            const resText = await response.text();

            if (!response.ok) {
                try {
                    const err = JSON.parse(resText);
                    throw new Error(err.error?.message || 'Groq API request failed');
                } catch {
                    throw new Error(`HTTP Error ${response.status}: ${resText.slice(0, 100)}`);
                }
            }

            try {
                data = JSON.parse(resText);
            } catch (e) {
                throw new Error("Invalid response from API (not JSON).");
            }

            const content = data.choices[0].message.content.trim();
            const llmDecision = JSON.parse(content);

            if (llmDecision.error) {
                setHistory(h => [...h, { type: 'agent', success: false, message: llmDecision.error }]);
                return;
            }

            // Ensure response is an array
            const actions = Array.isArray(llmDecision) ? llmDecision : [llmDecision];

            for (const step of actions) {
                const { action_id, action_type, value } = step;

                // Add an artificial small delay between steps for visual feedback
                if (actions.length > 1) {
                    await new Promise(r => setTimeout(r, 400));
                }

                if (!window.__AOM__.has(action_id)) {
                    setHistory(h => [...h, { type: 'agent', success: false, message: `LLM predicted unknown action ID: ${action_id}` }]);
                    break; // stop executing if a step fails
                } else {
                    const action = window.__AOM__.get(action_id);
                    let execMessage = '';

                    if (action_type === 'fill') {
                        if (action.kind === 'input') {
                            window.__AOM__.fill(action_id, value || '');
                            execMessage = `window.__AOM__.fill('${action_id}', '${value || ''}')`;
                        } else {
                            // tried to fill a button
                            window.__AOM__.execute(action_id);
                            execMessage = `window.__AOM__.execute('${action_id}') (fallback from fill)`;
                        }
                    } else if (action.type === 'navigate') {
                        window.__AOM__.navigate(action_id);
                        execMessage = `window.__AOM__.navigate('${action_id}')`;
                    } else {
                        window.__AOM__.execute(action_id);
                        execMessage = `window.__AOM__.execute('${action_id}')`;
                    }

                    // Update UI synchronously inside the loop
                    setHistory(h => [...h, { type: 'agent', success: true, message: execMessage, actionId: action_id }]);
                }
            }
        } catch (err) {
            setHistory(h => [...h, { type: 'agent', success: false, message: `Error: ${err.message}` }]);
        } finally {
            setIsProcessing(false);
        }
    };

    if (collapsed) {
        return (
            <button className="agent-dashboard-toggle" onClick={() => setCollapsed(false)}>
                🤖 Agent API
            </button>
        );
    }

    return (
        <div className="agent-dashboard">
            <div className="agent-dashboard__header">
                <h3>Agent Layer</h3>
                <div>
                    <button className="agent-settings-btn" onClick={() => setShowKeyConfig(!showKeyConfig)}>⚙️</button>
                    <button onClick={() => setCollapsed(true)}>—</button>
                </div>
            </div>

            {showKeyConfig ? (
                <div className="agent-key-config">
                    <h3>Configure Groq Inference</h3>
                    <p style={{ fontSize: 13, color: '#aaa', marginBottom: 16 }}>
                        To enable Natural Language mapping speeds of ~200ms, please provide a Groq API Key.
                        This key is only stored locally in your browser.
                    </p>
                    <input
                        type="password"
                        placeholder="gsk_..."
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '16px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 4 }}
                    />
                    <button
                        onClick={() => {
                            localStorage.setItem('__AOM_GROQ_KEY', apiKey);
                            setShowKeyConfig(false);
                        }}
                        style={{ width: '100%', padding: '8px', background: '#0066c0', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                    >
                        Save Key & Launch Agent
                    </button>
                    <button
                        onClick={() => setShowKeyConfig(false)}
                        style={{ width: '100%', padding: '8px', background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', marginTop: 8 }}
                    >
                        Skip for now
                    </button>
                </div>
            ) : (
                <div className="agent-dashboard__content">
                    <div className="agent-dashboard__history">
                        {history.map((item, i) => {
                            if (item.type === 'user') {
                                return <div key={i} className="agent-history-chat agent-history-chat--user">{item.text}</div>;
                            }
                            return (
                                <div key={i} className={`agent-history-item ${item.success ? 'agent-history-item--success' : 'agent-history-item--error'}`}>
                                    <span className="agent-history-cmd">⚡ {item.message}</span>
                                </div>
                            );
                        })}
                        <div ref={historyEndRef} />
                    </div>

                    <form className="agent-dashboard__form" onSubmit={executeCommand}>
                        <input
                            type="text"
                            value={cmdInput}
                            onChange={e => setCmdInput(e.target.value)}
                            placeholder="E.g., 'Add the Airpods to my cart'"
                            disabled={isProcessing}
                        />
                        <button type="submit" disabled={isProcessing || !cmdInput.trim()}>
                            {isProcessing ? '...' : 'Send'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
