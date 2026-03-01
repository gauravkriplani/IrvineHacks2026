import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import MarioPipeline from './MarioPipeline.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/toolkit" element={<MarioPipeline />} />
      </Routes>
    </BrowserRouter>
  );
}
