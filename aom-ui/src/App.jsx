import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './HomePage.jsx';
import AomUploadPage from './AomUploadPage.jsx';
import TeamsPage from './TeamsPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // 1. Instantly block natural scrolling logic
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.overflow = 'hidden';

    // 2. Initial attempt to jump
    window.scrollTo(0, 0);

    // 3. Wait for React to finish rendering the new DOM, then try again
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        // 4. Restore organic scrolling behavior
        document.body.style.overflow = '';
        document.documentElement.style.scrollBehavior = '';
      });
    });

    // 5. Hard fallback just in case the payload is super heavy
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timeoutId);
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
