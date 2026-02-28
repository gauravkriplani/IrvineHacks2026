import { useState } from 'react';
import { AOMAction } from '../../../aom-wrappers';

// Modern SVG Icons
const CheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const CircleIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

export default function ListTest() {
    const [items, setItems] = useState([
        { id: 1, name: 'Finalize quarterly marketing budget', completed: false },
        { id: 2, name: 'Review Q3 performance metrics with sales team', completed: true },
        { id: 3, name: 'Update user onboarding documentation', completed: false },
        { id: 4, name: 'Deploy v2.1.0 to staging environment', completed: false },
    ]);

    const completedCount = items.filter(i => i.completed).length;

    const toggleItem = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const deleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const addItem = () => {
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        setItems([{ id: newId, name: `New generated task ${newId}`, completed: false }, ...items]);
    };

    return (
        <div className="page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Project Tasks</h2>
                    <p>Track your team's active sprint deliverables.</p>
                </div>
                <AOMAction id="tasks.add_item" description="Create a new task" safety={0.9}>
                    <button onClick={addItem} className="btn btn-primary" style={{ padding: '10px 16px' }}>
                        + Create Task
                    </button>
                </AOMAction>
            </div>

            <div className="card">
                <div className="task-stats">
                    <div className="stat">
                        <span className="stat-val">{items.length}</span>
                        <span className="stat-label">Total Tasks</span>
                    </div>
                    <div className="stat">
                        <span className="stat-val" style={{ color: 'var(--success)' }}>{completedCount}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                    <div className="stat">
                        <span className="stat-val" style={{ color: 'var(--primary)' }}>{items.length - completedCount}</span>
                        <span className="stat-label">Remaining</span>
                    </div>
                </div>

                <ul className="task-list">
                    {items.map(item => (
                        <li key={item.id} className={`task-item ${item.completed ? 'completed' : ''}`}>
                            <div className="task-info">
                                <AOMAction
                                    id={`tasks.item.${item.id}.toggle`}
                                    description={`Mark "${item.name}" as ${item.completed ? 'incomplete' : 'complete'}`}
                                    safety={1}
                                >
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className="icon-btn"
                                        style={{ color: item.completed ? 'var(--success)' : 'var(--text-muted)' }}
                                    >
                                        {item.completed ? <CheckIcon /> : <CircleIcon />}
                                    </button>
                                </AOMAction>
                                <span className="task-name">{item.name}</span>
                            </div>

                            <div className="task-actions">
                                <AOMAction
                                    id={`tasks.item.${item.id}.delete`}
                                    description={`Delete "${item.name}"`}
                                    safety={0.5}
                                >
                                    <button onClick={() => deleteItem(item.id)} className="icon-btn delete">
                                        <TrashIcon />
                                    </button>
                                </AOMAction>
                            </div>
                        </li>
                    ))}
                    {items.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            No active tasks remaining. You're all caught up! ✨
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
