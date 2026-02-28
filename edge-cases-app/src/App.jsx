import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ListTest from './pages/ListTest';
import AgentDashboard from './components/AgentDashboard/AgentDashboard';
import { AOMLink } from '../../aom-wrappers';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">

        {/* Modern Sidebar */}
        <nav className="sidebar">
          <h1><span></span> Orbit Workspace</h1>

          <div className="nav-links">
            <AOMLink id="nav.settings" description="Navigate to settings" destination="Settings" group="nav">
              <Link to="/" className="nav-link">Settings & Profile</Link>
            </AOMLink>

            <AOMLink id="nav.tasks" description="Navigate to tasks" destination="Tasks" group="nav">
              <Link to="/list" className="nav-link">Task Manager</Link>
            </AOMLink>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<ListTest />} />
          </Routes>
        </main>

      </div>

      {/* Dynamic Floating Agent Dashboard */}
      <AgentDashboard />
    </BrowserRouter>
  );
}

export default App;
