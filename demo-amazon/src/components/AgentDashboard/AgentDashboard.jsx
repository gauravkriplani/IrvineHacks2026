import { useState, useEffect, useRef } from 'react';
import AOMRegistry from '../../../../aom-wrappers/AOMRegistry';
import logoImg from '../../assets/logo.webp';
import MorphingParticles from '../MorphingParticles/MorphingParticles';
import './AgentDashboard.css';

function MicIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
    );
}

function StopIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
        </svg>
    );
}

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

export default function AgentDashboard({ isOpen, onToggle }) {
    const [agentState, setAgentState] = useState({});
    const [cmdInput, setCmdInput] = useState(''); // Renamed from 'command'
    const [history, setHistory] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [pendingApproval, setPendingApproval] = useState(null);
    const approvalResolverRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const historyEndRef = useRef(null);
    const apiKey = import.meta.env.VITE_GROQ_KEY;

    const toggleRecording = async (e) => {
        if (e) e.preventDefault();

        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
            return;
        }

        // Optimistic UI update to prevent finicky double-clicks while stream loads
        setIsRecording(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Prefer webm, fallback to mp4
            let options = {};
            if (MediaRecorder.isTypeSupported('audio/webm')) {
                options = { mimeType: 'audio/webm' };
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                options = { mimeType: 'audio/mp4' };
            }

            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach(track => track.stop());

                const mimeType = mediaRecorder.mimeType || 'audio/webm';
                let ext = 'webm';
                // Groq Whisper expects .mp4 for the audio/mp4 container, .m4a sometimes causes parsing failure
                if (mimeType.includes('mp4') || mimeType.includes('m4a')) ext = 'mp4';
                if (mimeType.includes('ogg')) ext = 'ogg';

                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

                // Prevent empty/too short recordings from causing "invalid media file" API errors
                if (audioBlob.size < 500) {
                    setIsProcessing(false);
                    setHistory(h => [...h, { type: 'agent', success: false, message: 'Audio recording was too short or empty.' }]);
                    return;
                }

                const file = new File([audioBlob], `speech.${ext}`, { type: mimeType });

                const formData = new FormData();
                formData.append('file', file);
                formData.append('model', 'whisper-large-v3-turbo');
                formData.append('language', 'en');

                // Don't show the "Agent Processing" UI for transcription
                try {
                    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: formData
                    });

                    if (!response.ok) {
                        const errObj = await response.json().catch(() => ({}));
                        throw new Error(errObj.error?.message || 'Transcription failed');
                    }

                    const data = await response.json();
                    if (data.text) {
                        // Instantly submit the transcribed query
                        executeCommand(data.text);
                    }
                } catch (err) {
                    setHistory(h => [...h, { type: 'agent', success: false, message: `Speech-to-text error: ${err.message}` }]);
                }
            };

            mediaRecorder.start();
        } catch (err) {
            console.error('Mic access denied:', err);
            setIsRecording(false);
            setHistory(h => [...h, { type: 'agent', success: false, message: 'Microphone access denied or unavailable.' }]);
        }
    };

    const handleApproval = (approved) => {
        if (approvalResolverRef.current) {
            approvalResolverRef.current(approved);
            approvalResolverRef.current = null;
        }
        setPendingApproval(null);
    };

    // Auto-scroll to bottom of history
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        return () => clearTimeout(timeoutId);
    }, [history, pendingApproval, isProcessing]);

    // Spacebar to toggle recording (push to talk)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                toggleRecording();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isRecording]);

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

    const executeCommand = async (eOrCmd) => {
        if (eOrCmd && eOrCmd.preventDefault) eOrCmd.preventDefault();

        const cmdText = typeof eOrCmd === 'string' ? eOrCmd : cmdInput;
        const cmd = cmdText.trim();
        if (!cmd || isProcessing || !apiKey) return;

        setCmdInput('');
        setIsProcessing(true);
        setHistory(h => [...h, { type: 'user', text: cmd }]);

        try {
            let isTaskCompleted = false;
            let iteration = 0;
            const MAX_ITER = 20;

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

                        // Human-in-the-loop safety gap
                        if (action.needsReview) {
                            setPendingApproval(action);
                            const approved = await new Promise(resolve => {
                                approvalResolverRef.current = resolve;
                            });

                            if (!approved) {
                                setHistory(h => [...h, { type: 'agent', success: false, message: `Action '${action_id}' was rejected by the user.` }]);
                                // Resume the agent loop so it can potentially try something else,
                                // but we skip executing the rejected action.
                                continue;
                            }
                        }

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

    if (!isOpen) {
        return (
            <button className="agent-dashboard-toggle" onClick={() => onToggle()}>
                <img src={logoImg} alt="Agent Native" className="agent-dashboard-toggle__logo" />
            </button>
        );
    }

    return (
        <div className="agent-dashboard">
            <div className="agent-dashboard-bg" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
                <MorphingParticles
                    targetRef={{ current: null }}
                    isHovered={false}
                    ambientScale={1.3}
                    color1="#10b981"
                    color2="#059669"
                    color3="#34d399"
                />
            </div>
            <div className="agent-dashboard__header">
                <div className="agent-dashboard__brand">
                    <img src={logoImg} alt="Agent Native logo" className="agent-dashboard__logo" />
                    <span className="agent-dashboard__title">Agent Native</span>
                </div>
                <div>
                    <button className="agent-dashboard__close" onClick={() => onToggle()}>✕</button>
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
                                <span className="agent-history-cmd">{item.message}</span>
                            </div>
                        );
                    })}

                    {pendingApproval && (
                        <div className="agent-approval-prompt">
                            <div className="agent-approval-header">⚠️ Human Review Required</div>
                            <div className="agent-approval-desc">
                                The agent wants to execute a protected action:<br />
                                <strong>{pendingApproval.description || pendingApproval.action_id}</strong>
                            </div>
                            <div className="agent-approval-actions">
                                <button className="agent-btn-reject" onClick={() => handleApproval(false)}>Reject</button>
                                <button className="agent-btn-approve" onClick={() => handleApproval(true)}>Approve</button>
                            </div>
                        </div>
                    )}

                    {!pendingApproval && isProcessing && (
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
                    <div className="agent-dashboard__actions">
                        <button
                            type="button"
                            className={`agent-dashboard__mic ${isRecording ? 'recording' : ''}`}
                            onClick={toggleRecording}
                            disabled={isProcessing}
                            title="Speak to Agent"
                        >
                            {isRecording ? <StopIcon /> : <MicIcon />}
                        </button>
                        <button type="submit" disabled={isProcessing || !cmdInput.trim()}>
                            {isProcessing ? '...' : 'Send'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
