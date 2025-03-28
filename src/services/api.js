import axios from 'axios';

// Utiliser l'URL configurée dans .env ou une URL par défaut
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajout d'un intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Service d'API pour les emails
export const emailService = {
  // Génération d'emails
  generateEmails: (formData) => {
    return api.post('/api/emails/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Récupération des emails par stage
  getEmailsByStage: (stage) => {
    return api.get(`/api/emails/by-stage/${stage}`);
  },

  // Mise à jour du statut d'un email
  updateEmailStatus: (emailId, status) => {
    return api.put(`/api/emails/${emailId}/status`, { status });
  },

  // Mise à jour du stage d'un email
  updateEmailStage: (emailId, stage) => {
    return api.put(`/api/emails/${emailId}/stage`, { stage });
  },

  // Récupération d'informations sur le cache
  getCacheInfo: () => {
    return api.get('/api/emails/cache');
  },

  // Vidage du cache
  clearCache: () => {
    return api.delete('/api/emails/cache');
  },
};

// Service d'API pour les templates
export const templateService = {
  // Récupération de tous les templates
  getAllTemplates: () => {
    return api.get('/api/emails/templates');
  },

  // Récupération d'un template par ID
  getTemplate: (templateId) => {
    return api.get(`/api/emails/templates/${templateId}`);
  },

  // Création d'un nouveau template
  createTemplate: (template) => {
    return api.post('/api/emails/templates', template);
  },

  // Mise à jour d'un template
  updateTemplate: (templateId, template) => {
    return api.put(`/api/emails/templates/${templateId}`, template);
  },

  // Suppression d'un template
  deleteTemplate: (templateId) => {
    return api.delete(`/api/emails/templates/${templateId}`);
  },
};

// Service d'API pour les amis et le partage de cache
export const friendService = {
  // Envoi d'une demande d'ami
  sendFriendRequest: (email) => {
    return api.post('/api/friends/request', { email });
  },

  // Récupération des demandes d'amis
  getFriendRequests: () => {
    return api.get('/api/friends/requests');
  },

  // Réponse à une demande d'ami
  respondToFriendRequest: (requestId, status) => {
    return api.post('/api/friends/respond', { request_id: requestId, status });
  },

  // Récupération de la liste des amis
  getFriendsList: () => {
    return api.get('/api/friends/list');
  },

  // Activation/désactivation du partage de cache avec un ami
  toggleCacheSharing: (friendId, share) => {
    return api.post(`/api/friends/share/${friendId}`, { share });
  },

  // Récupération des emails partagés
  getSharedEmails: () => {
    return api.get('/api/friends/shared-emails');
  },

  // Partage d'un email avec les amis
  shareEmail: (email) => {
    return api.post('/api/friends/share-email', { email });
  },
};

export default api; 