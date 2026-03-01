import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import AomUploadPage from './AomUploadPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/toolkit" element={<AomUploadPage />} />
      </Routes>
    </BrowserRouter>
  );
}
