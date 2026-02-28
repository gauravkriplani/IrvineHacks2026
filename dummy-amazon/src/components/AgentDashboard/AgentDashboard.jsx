import { useState, useEffect } from 'react';
import AOMRegistry from '../../../../aom-wrappers/AOMRegistry';
import './AgentDashboard.css';

export default function AgentDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [agentState, setAgentState] = useState({});
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState([]);
    const [apiKey, setApiKey] = useState(() => import.meta.env.VITE_OPEN_AI_KEY || localStorage.getItem('openai_api_key') || '');
    const [isConfiguring, setIsConfiguring] = useState(!(import.meta.env.VITE_OPEN_AI_KEY || localStorage.getItem('openai_api_key')));
    const [isProcessing, setIsProcessing] = useState(false);
    const [useAOM, setUseAOM] = useState(true);
    const [liveHTML, setLiveHTML] = useState('');

    // Update live HTML when not using AOM
    useEffect(() => {
        if (!useAOM) {
            const updateHTML = () => {
                // We truncate to avoid absolutely destroying the DOM / LLM
                const html = document.documentElement.outerHTML;
                setLiveHTML(html.length > 50000 ? html.substring(0, 50000) + '... [TRUNCATED FOR DISPLAY]' : html);
            };
            updateHTML();
            const interval = setInterval(updateHTML, 2000);
            return () => clearInterval(interval);
        }
    }, [useAOM]);

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

    const saveApiKey = () => {
        localStorage.setItem('openai_api_key', apiKey);
        setIsConfiguring(false);
    };

    const processLLMCommand = async (naturalCommand, currentState) => {
        if (!apiKey) throw new Error("OpenAI API Key is missing. Please configure it.");

        let systemPrompt = '';
        if (useAOM) {
            systemPrompt = `You are an AI browser agent translating natural language commands into explicit UI actions.
You have access to the following Agent Object Model (AOM) state representing the currently available UI interactive elements:
${JSON.stringify(currentState, null, 2)}

Your job is to match the user's request to the BEST single available action.
Return a RAW JSON object (no markdown, no backticks) with:
{
  "actionId": "the string key from the AOM state",
  "actionType": "execute" | "navigate" | "fill",
  "value": "the string value to fill if actionType is fill, otherwise omit"
}
If no action matches the user request, return { "error": "No matching action found." }`;
        } else {
            // Provide a VERY strict and short prompt so the massive HTML doesn't cause hallucination of the format
            systemPrompt = `You are an AI browser agent automating a website. Below is the raw HTML of the current page (it may be truncated). Your goal is to figure out the CSS selector of the element the user wants to interact with based on their command.

RAW HTML:
${document.documentElement.outerHTML.substring(0, 40000)}

Your job is to match the user's request to the BEST single available element in the HTML.
Return a RAW JSON object (no markdown, no backticks) EXACTLY matching this format:
{
  "selector": "the CSS selector of the element to interact with",
  "actionType": "click" | "type",
  "value": "text to type if actionType is type, otherwise leave empty"
}
If no action matches, return { "error": "No matching action found." }`;
        }

        const response = await fetch('/api/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: naturalCommand }
                ],
                temperature: 0,
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        return JSON.parse(content);
    };

    const executeCommand = async (e) => {
        e.preventDefault();
        if (!command.trim() || isProcessing) return;

        const cmd = command.trim();
        setCommand('');
        setIsProcessing(true);
        setHistory(h => [...h, { type: 'user', text: cmd }]);

        try {
            const state = window.__AOM__.getState();
            const llmDecision = await processLLMCommand(cmd, state);

            if (llmDecision.error) {
                setHistory(h => [...h, { type: 'agent', success: false, message: llmDecision.error }]);
            } else {
                if (useAOM) {
                    const { actionId, actionType, value } = llmDecision;

                    if (!window.__AOM__.has(actionId)) {
                        setHistory(h => [...h, { type: 'agent', success: false, message: `LLM predicted unknown action ID: ${actionId}` }]);
                    } else {
                        let execMessage = '';
                        if (actionType === 'fill') {
                            window.__AOM__.fill(actionId, value);
                            execMessage = `window.__AOM__.fill('${actionId}', '${value}')`;
                        } else if (actionType === 'navigate') {
                            window.__AOM__.navigate(actionId);
                            execMessage = `window.__AOM__.navigate('${actionId}')`;
                        } else {
                            window.__AOM__.execute(actionId);
                            execMessage = `window.__AOM__.execute('${actionId}')`;
                        }

                        setHistory(h => [...h, { type: 'agent', success: true, message: execMessage, actionId }]);
                    }
                } else {
                    const { selector, actionType, value } = llmDecision;
                    const el = document.querySelector(selector);
                    if (!el) {
                        setHistory(h => [...h, { type: 'agent', success: false, message: `Element not found: ${selector}` }]);
                    } else {
                        let execMessage = '';
                        if (actionType === 'type') {
                            el.value = value || '';
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            execMessage = `document.querySelector('${selector}').value = '${value}'`;
                        } else {
                            el.click();
                            execMessage = `document.querySelector('${selector}').click()`;
                        }
                        setHistory(h => [...h, { type: 'agent', success: true, message: execMessage, actionId: selector }]);
                    }
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
                <h3>🤖 Agent API Surface</h3>
                <div>
                    <button className="agent-settings-btn" onClick={() => setIsConfiguring(!isConfiguring)}>⚙️</button>
                    <button onClick={() => setCollapsed(true)}>—</button>
                </div>
            </div>

            <div className="agent-dashboard__content">
                {isConfiguring ? (
                    <div className="agent-dashboard__config">
                        <p style={{ fontSize: 13, marginBottom: 8, color: '#aaa' }}>Enter your OpenAI API Key to enable natural language commands.</p>
                        <input
                            type="password"
                            placeholder="sk-..."
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            className="agent-config-input"
                        />
                        <button onClick={saveApiKey} className="agent-config-save">Save Key</button>
                    </div>
                ) : (
                    <>
                        <div className="agent-dashboard__toggle-group">
                            <label className={`agent-dashboard__toggle-label ${useAOM ? 'agent-dashboard__toggle-label--active' : ''}`}>
                                <input type="radio" checked={useAOM} onChange={() => setUseAOM(true)} />
                                AI with AOM
                            </label>
                            <label className={`agent-dashboard__toggle-label ${!useAOM ? 'agent-dashboard__toggle-label--active' : ''}`}>
                                <input type="radio" checked={!useAOM} onChange={() => setUseAOM(false)} />
                                Standard Web Agent (HTML)
                            </label>
                        </div>

                        <div className="agent-dashboard__state">
                            <h4>{useAOM ? 'Live AOM State (Clean JSON)' : 'Live DOM State (Raw HTML)'}</h4>
                            <pre>{useAOM ? JSON.stringify(agentState, null, 2) : liveHTML}</pre>
                        </div>

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
                        </div>

                        <form className="agent-dashboard__form" onSubmit={executeCommand}>
                            <input
                                type="text"
                                value={command}
                                onChange={e => setCommand(e.target.value)}
                                placeholder="E.g., 'Add the Macbook to my cart'"
                                disabled={isProcessing}
                            />
                            <button type="submit" disabled={isProcessing || !command.trim()}>
                                {isProcessing ? '...' : 'Send'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
