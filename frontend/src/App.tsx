import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DocumentViewer from './pages/DocumentViewer';
import PlaybookManager from './pages/PlaybookManager';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents/:id" element={<DocumentViewer />} />
            <Route path="/playbooks" element={<PlaybookManager />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;