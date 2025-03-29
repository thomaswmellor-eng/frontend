import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import GenerateEmailsPage from './pages/GenerateEmailsPage';
import TemplatesPage from './pages/TemplatesPage';
import SettingsPage from './pages/SettingsPage';
import FriendsButton from './components/FriendsButton';
import AuthScreen from './components/AuthScreen';
import { UserProvider, UserContext } from './contexts/UserContext';
import './App.css';

// Composant de routes protégées
const ProtectedRoutes = () => {
  const { authenticated, loading } = useContext(UserContext);
  
  // Si le chargement est en cours, on n'affiche rien
  if (loading) {
    return <div className="text-center p-5">Chargement...</div>;
  }
  
  // Si l'utilisateur n'est pas authentifié, on le redirige vers la page d'accueil
  if (!authenticated) {
    return <AuthScreen />;
  }
  
  // Sinon, on affiche les routes protégées
  return (
    <>
      <Navigation />
      <Container className="flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate-emails" element={<GenerateEmailsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
      <FriendsButton />
    </>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <ProtectedRoutes />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App; 