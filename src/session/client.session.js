import { clients, users } from './session.js';

export const addClient = (socket, userId) => {
  clients.set(userId, socket);
};

export const removeClient = (email) => {
  clients.delete(email);
};

export const clearClients = () => {
  clients.clear();
  users.clear();
  console.log('All clients cleared');
};
