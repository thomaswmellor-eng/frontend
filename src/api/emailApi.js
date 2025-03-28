import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

// Créer une instance axios avec une configuration par défaut
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Génère des emails à partir d'un fichier CSV de contacts
 * 
 * @param {File} file - Fichier CSV contenant les contacts
 * @param {boolean} useAi - Utiliser l'IA pour la génération (true) ou un template (false)
 * @param {string} templateId - ID du template à utiliser (si useAi est false)
 * @param {Object} userInfo - Informations sur l'utilisateur pour personnaliser les emails
 * @returns {Promise} - La réponse de l'API
 */
export const generateEmails = async (file, useAi = true, templateId = null, userInfo = null) => {
  // Créer un FormData pour envoyer le fichier
  const formData = new FormData();
  formData.append('file', file);
  formData.append('use_ai', useAi);
  
  if (templateId) {
    formData.append('template_id', templateId);
  }
  
  // Ajouter les informations utilisateur si fournies
  if (userInfo) {
    if (userInfo.companyName) formData.append('company_name', userInfo.companyName);
    if (userInfo.yourName) formData.append('your_name', userInfo.yourName);
    if (userInfo.yourPosition) formData.append('your_position', userInfo.yourPosition);
    if (userInfo.yourContact) formData.append('your_contact', userInfo.yourContact);
  }
  
  try {
    const response = await api.post('/api/emails/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error generating emails:', error);
    throw error;
  }
};

/**
 * Récupère la liste des templates d'emails disponibles
 * 
 * @returns {Promise} - La réponse de l'API
 */
export const getTemplates = async () => {
  try {
    const response = await api.get('/api/emails/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

/**
 * Sauvegarde un nouveau template d'email
 * 
 * @param {Object} template - Le template à sauvegarder
 * @returns {Promise} - La réponse de l'API
 */
export const saveTemplate = async (template) => {
  try {
    const response = await api.post('/api/emails/templates', template);
    return response.data;
  } catch (error) {
    console.error('Error saving template:', error);
    throw error;
  }
};

/**
 * Récupère des informations sur le cache d'emails
 * 
 * @returns {Promise} - La réponse de l'API
 */
export const getCacheInfo = async () => {
  try {
    const response = await api.get('/api/emails/cache');
    return response.data;
  } catch (error) {
    console.error('Error fetching cache info:', error);
    throw error;
  }
};

/**
 * Vide le cache d'emails
 * 
 * @returns {Promise} - La réponse de l'API
 */
export const clearCache = async () => {
  try {
    const response = await api.delete('/api/emails/cache');
    return response.data;
  } catch (error) {
    console.error('Error clearing cache:', error);
    throw error;
  }
};

// Routes pour les amis et le partage de cache
export const getFriends = async () => {
  const response = await api.get('/api/friends');
  return response.data;
};

export const sendFriendRequest = async (email, name) => {
  const response = await api.post('/api/friends/request', { email, name });
  return response.data;
};

export const acceptFriendRequest = async (requestId) => {
  const response = await api.post(`/api/friends/accept/${requestId}`);
  return response.data;
};

export const rejectFriendRequest = async (requestId) => {
  const response = await api.delete(`/api/friends/reject/${requestId}`);
  return response.data;
};

export const cancelFriendRequest = async (requestId) => {
  const response = await api.delete(`/api/friends/cancel/${requestId}`);
  return response.data;
};

export const removeFriend = async (friendId) => {
  const response = await api.delete(`/api/friends/remove/${friendId}`);
  return response.data;
};

export const toggleFriendSharing = async (friendId) => {
  const response = await api.put(`/api/friends/toggle/${friendId}`);
  return response.data;
};

export const syncCache = async (friendId, entries) => {
  const response = await api.post('/api/friends/sync', { friend_id: friendId, entries });
  return response.data;
};

export default {
  generateEmails,
  getTemplates,
  saveTemplate,
  getCacheInfo,
  clearCache,
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  toggleFriendSharing,
  syncCache
}; 