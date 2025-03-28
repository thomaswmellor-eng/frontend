import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import GenerateEmailsPage from './pages/GenerateEmailsPage';
import TemplatesPage from './pages/TemplatesPage';
import SettingsPage from './pages/SettingsPage';
import FriendsButton from './components/FriendsButton';
import { UserProvider } from './contexts/UserContext';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Navigation />
          <Container className="flex-grow-1 py-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/generate-emails" element={<GenerateEmailsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Container>
          <FriendsButton />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App; 