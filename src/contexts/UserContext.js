import React, { createContext, useState, useEffect } from 'react';

// Création du contexte
export const UserContext = createContext();

// Provider du contexte
export const UserProvider = ({ children }) => {
  // État initial
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger le profil utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Error parsing stored profile:', e);
        localStorage.removeItem('userProfile');
      }
    }
    setLoading(false);
  }, []);

  // Sauvegarder le profil dans le localStorage quand il change
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Mettre à jour le profil utilisateur
  const updateUserProfile = (profile) => {
    setUserProfile(profile);
  };

  // Supprimer le profil utilisateur
  const clearUserProfile = () => {
    setUserProfile(null);
    localStorage.removeItem('userProfile');
  };

  return (
    <UserContext.Provider 
      value={{ 
        userProfile, 
        updateUserProfile, 
        clearUserProfile,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 