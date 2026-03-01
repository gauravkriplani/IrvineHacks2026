import { useState, useEffect, useRef } from 'react';
import AOMRegistry from '../../../../aom-wrappers/AOMRegistry';
import './AgentDashboard.css';

const PROMPT = `
You are a deterministic mapping agent for a user interface.
You will be provided with a user's intent in plain english, and a JSON object representing exactly what interactive elements are currently on the screen.

Your job is to figure out the BEST sequence of elements to fulfill the user's intent, and the correct action to take on them.
If the chosen element has a \`kind\` of "input", you MUST provide what text to fill into the input. Otherwise, it is just a click.

Respond ONLY with a JSON object that strictly follows this JSON format:
{
  "task_completed": boolean, // True if the user's ultimate goal has been achieved. False if you need the UI to change (navigate, click, reload) in order to proceed closer to the goal.
  "actions": [               // The sequence of actions to take on THIS current screen state.
    { "action_id": "element_id", "action_type": "fill" | "execute", "value": "optional string" }
  ]
}

No other text should be present in your response.

Example response for filling a search bar:
{
  "task_completed": false,
  "actions": [
    { "action_id": "header.search_input", "action_type": "fill", "value": "airpods" },
    { "action_id": "header.submit_search", "action_type": "execute" }
  ]
}

Example response for just clicking a button:
{
  "task_completed": true,
  "actions": [
    { "action_id": "product.5.add_to_cart", "action_type": "execute" }
  ]
}
`;

export default function AgentDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [agentState, setAgentState] = useState({});
    const [cmdInput, setCmdInput] = useState(''); // Renamed from 'command'
    const [history, setHistory] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const historyEndRef = useRef(null);
    const apiKey = import.meta.env.VITE_GROQ_KEY;

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
            let isTaskCompleted = false;
            let iteration = 0;
            const MAX_ITER = 10;

            // Initialize conversation history with exactly the system prompt and the first user input
            const messages = [
                { role: 'system', content: PROMPT },
                { role: 'user', content: JSON.stringify({ user_intent: cmd, ui_elements: window.__AOM__.getState() }, null, 2) }
            ];

            while (!isTaskCompleted && iteration < MAX_ITER) {
                iteration++;

                const response = await fetch('/api/groq/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'llama-3.3-70b-versatile',
                        response_format: { type: 'json_object' },
                        messages: messages,
                        temperature: 0,
                    })
                });

                const resText = await response.text();

                if (!response.ok) {
                    try {
                        const err = JSON.parse(resText);
                        throw new Error(err.error?.message || 'Groq API request failed');
                    } catch {
                        throw new Error(`HTTP Error ${response.status}: ${resText.slice(0, 100)}`);
                    }
                }

                let data;
                try {
                    data = JSON.parse(resText);
                } catch (e) {
                    throw new Error("Invalid response from API (not JSON).");
                }

                const content = data.choices[0].message.content.trim();
                const llmDecision = JSON.parse(content);

                // Add the agent's response to the conversation history
                messages.push({ role: 'assistant', content: content });

                if (llmDecision.error) {
                    setHistory(h => [...h, { type: 'agent', success: false, message: llmDecision.error }]);
                    break;
                }

                const actions = llmDecision.actions || [];
                isTaskCompleted = llmDecision.task_completed === true;

                for (const step of actions) {
                    const { action_id, action_type, value } = step;

                    // Add an artificial small delay between steps for visual feedback
                    if (actions.length > 1) {
                        await new Promise(r => setTimeout(r, 400));
                    }

                    if (!window.__AOM__.has(action_id)) {
                        setHistory(h => [...h, { type: 'agent', success: false, message: `LLM predicted unknown action ID: ${action_id}` }]);
                        isTaskCompleted = true; // Force exit
                        break;
                    } else {
                        const action = window.__AOM__.get(action_id);
                        let execMessage = '';

                        if (action_type === 'fill') {
                            if (action.kind === 'input') {
                                window.__AOM__.fill(action_id, value || '');
                                execMessage = `Typed "${value || ''}" into ${action.description || action_id}`;
                            } else {
                                // tried to fill a button
                                window.__AOM__.execute(action_id);
                                execMessage = `Clicked ${action.description || action_id} (fallback from fill)`;
                            }
                        } else if (action.type === 'navigate') {
                            window.__AOM__.navigate(action_id);
                            execMessage = `Navigated to ${action.description || action_id}`;
                        } else {
                            window.__AOM__.execute(action_id);
                            execMessage = `Clicked ${action.description || action_id}`;
                        }

                        // Update UI synchronously inside the loop
                        setHistory(h => [...h, { type: 'agent', success: true, message: execMessage, actionId: action_id }]);
                    }
                }

                if (!isTaskCompleted && actions.length === 0) {
                    // LLM decided task wasn't complete but provided no actions to advance. Force exit to avoid rapid infinite loops.
                    setHistory(h => [...h, { type: 'agent', success: false, message: 'Agent loop stalled with no actions.' }]);
                    break;
                }

                if (!isTaskCompleted && iteration < MAX_ITER) {
                    // We need to fetch the updated state. Give React a moment to render any animations/route changes.
                    await new Promise(r => setTimeout(r, 600));

                    const newState = window.__AOM__.getState();
                    messages.push({
                        role: 'user',
                        content: JSON.stringify({
                            instruction: "Action batch completed. Here is the updated screen UI state. Proceed with the next steps of the original goal.",
                            ui_elements: newState
                        }, null, 2)
                    });
                }
            }

            if (!isTaskCompleted && iteration >= MAX_ITER) {
                setHistory(h => [...h, { type: 'agent', success: false, message: 'Max conversation turns reached without task completion.' }]);
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
                <div className="agent-dashboard__brand">
                    <span className="agent-dashboard__title">AgentNative</span>
                </div>
                <div>
                    <button onClick={() => setCollapsed(true)}>—</button>
                </div>
            </div>

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

                    {isProcessing && (
                        <div className="agent-working-indicator">
                            <span className="agent-working-blob"></span>
                            <span className="agent-working-text">Agent is working...</span>
                        </div>
                    )}

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
        </div>
    );
}
