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
    const [contextMode, setContextMode] = useState('AOM'); // 'AOM' | 'HTML'

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
        if (contextMode === 'AOM') {
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
            const rawHTML = document.documentElement.outerHTML.substring(0, 100000); // Send massive chunk for demo comparison
            systemPrompt = `You are an AI browser agent automating a website. This is the raw HTML of the page you are on:
${rawHTML}

Your job is to find the right element to interact with based on the user's request.
Return a RAW JSON object (no markdown, no backticks) with:
{
  "actionId": "DOM element selector, e.g., #nav-cart or .buy-button",
  "actionType": "execute",
  "error": "If you cannot easily identify the exact deterministic action to take from this mess, explain why it's hard to parse."
}`;
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
            } else if (contextMode === 'HTML') {
                // If the agent actually returns a selector (which is extremely hard), just show it.
                setHistory(h => [...h, { type: 'agent', success: false, message: `HTML Selector Predicted: ${llmDecision.actionId} (Likely fragile)` }]);
            } else {
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
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div className="agent-dashboard__mode-toggle">
                        <button className={contextMode === 'AOM' ? 'active' : ''} onClick={() => setContextMode('AOM')}>AOM</button>
                        <button className={contextMode === 'HTML' ? 'active' : ''} onClick={() => setContextMode('HTML')}>HTML</button>
                    </div>
                    <button className="agent-settings-btn" onClick={() => setIsConfiguring(!isConfiguring)}>⚙️</button>
                    <button className="agent-minimize-btn" onClick={() => setCollapsed(true)}>—</button>
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
                        <div className="agent-dashboard__state">
                            <h4>{contextMode === 'AOM' ? 'Live AOM State' : 'Raw HTML State (Visualized)'}</h4>
                            <pre>
                                {contextMode === 'AOM'
                                    ? JSON.stringify(agentState, null, 2)
                                    : document.documentElement.outerHTML.substring(0, 3000) + '\n\n... [VISUALLY TRUNCATED FOR BROWSER PERFORMANCE] ...\n... [THE FULL 180KB+ RAW HTML STRING IS STILL SENT TO THE LLM IN THE BACKGROUND] ...'}
                            </pre>
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
