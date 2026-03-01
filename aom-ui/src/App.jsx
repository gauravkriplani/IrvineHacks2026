import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './HomePage.jsx';
import AomUploadPage from './AomUploadPage.jsx';
import TeamsPage from './TeamsPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/toolkit" element={<AomUploadPage />} />
        <Route path="/team"    element={<TeamsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
