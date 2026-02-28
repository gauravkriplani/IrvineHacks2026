import { useState, useEffect } from 'react';
import AOMRegistry from '../../../../../../aom-wrappers/AOMRegistry';
import './AgentDashboard.css';

export default function AgentDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [agentState, setAgentState] = useState({});
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState([]);

    // Keep the JSON view in sync with the live AOMRegistry
    useEffect(() => {
        const updateState = () => {
            setAgentState(AOMRegistry.getState());
        };

        // Initial state
        updateState();

        // Listen for mounts/unmounts
        const unsubscribe = AOMRegistry.onChange(() => {
            updateState();
        });

        return unsubscribe;
    }, []);

    const executeCommand = (e) => {
        e.preventDefault();
        if (!command.trim()) return;

        const cmd = command.trim();
        let success = false;
        let message = '';

        try {
            // Very basic matching for demo purposes
            if (cmd.startsWith('fill ')) {
                // e.g. "fill auth.login.username testuser"
                const [, id, ...valParts] = cmd.split(' ');
                const val = valParts.join(' ');
                AOMRegistry.fill(id, val);
                success = true;
                message = `Filled ${id} with "${val}"`;
            } else if (AOMRegistry.has(cmd)) {
                // Exact action ID match
                const action = AOMRegistry.get(cmd);
                if (action.kind === 'link') {
                    AOMRegistry.navigate(cmd);
                    message = `Navigated via ${cmd}`;
                } else {
                    AOMRegistry.execute(cmd);
                    message = `Executed ${cmd}`;
                }
                success = true;
            } else {
                // Try fuzzy matching
                const state = AOMRegistry.getState();
                const matchedId = Object.keys(state).find(id =>
                    id.toLowerCase().includes(cmd.toLowerCase()) ||
                    state[id].description.toLowerCase().includes(cmd.toLowerCase())
                );

                if (matchedId) {
                    const action = AOMRegistry.get(matchedId);
                    if (action.kind === 'link') {
                        AOMRegistry.navigate(matchedId);
                    } else if (action.kind !== 'input') {
                        AOMRegistry.execute(matchedId);
                    }
                    success = true;
                    message = `Fuzzy matched and executed ${matchedId}`;
                } else {
                    message = `Unknown command: ${cmd}`;
                }
            }
        } catch (err) {
            success = false;
            message = `Error: ${err.message}`;
        }

        setHistory(h => [...h, { cmd, success, message }]);
        setCommand('');
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
                <button onClick={() => setCollapsed(true)}>_</button>
            </div>

            <div className="agent-dashboard__content">
                <div className="agent-dashboard__state">
                    <h4>Live AOM State</h4>
                    <pre>{JSON.stringify(agentState, null, 2)}</pre>
                </div>

                <div className="agent-dashboard__history">
                    {history.map((item, i) => (
                        <div key={i} className={`agent-history-item ${item.success ? 'agent-history-item--success' : 'agent-history-item--error'}`}>
                            <span className="agent-history-cmd">&gt; {item.cmd}</span>
                            <span className="agent-history-msg">{item.message}</span>
                        </div>
                    ))}
                </div>

                <form className="agent-dashboard__form" onSubmit={executeCommand}>
                    <input
                        type="text"
                        value={command}
                        onChange={e => setCommand(e.target.value)}
                        placeholder="Type an exact action_id or 'fill [id] [value]'"
                    />
                    <button type="submit">Run</button>
                </form>
            </div>
        </div>
    );
}
