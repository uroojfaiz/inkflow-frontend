import api from './api';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const toggleLike = (blogId) => api.post(`/interactions/like/${blogId}`, {}, getHeaders());
export const followUser = (userId) => api.post(`/interactions/follow/${userId}`, {}, getHeaders());
export const addComment = (blogId, text) => api.post(`/interactions/comment/${blogId}`, { text }, getHeaders());
export const fetchNotifications = () => api.get('/interactions/notifications', getHeaders());