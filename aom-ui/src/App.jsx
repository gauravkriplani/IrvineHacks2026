import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './HomePage.jsx';
import AomUploadPage from './AomUploadPage.jsx';
import TeamsPage from './TeamsPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Temporarily remove smooth scrolling so the jump to top is instant 
    // and not intercepted by the CSS snap engine
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);

    // Restore behavior after the paint
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = '';
    });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/toolkit" element={<AomUploadPage />} />
        <Route path="/team" element={<TeamsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
