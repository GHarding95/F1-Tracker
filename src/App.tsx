import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <div className="app-shell app-shell--layout">
      <div className="app-shell__noise" aria-hidden />
      <div className="app-shell__content flex flex-col flex-1 w-full min-w-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default App;
