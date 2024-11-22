import { clients, users } from './session.js';

export const addClient = (socket, userId) => {
  clients.set(userId, socket); // 정수형이긴한데 object
};

export const addUser = (token, userData) => {
  users.set(token, userData);
};

export const removeClient = (email) => {
  clients.delete(email);
};

export const clearClients = () => {
  clients.clear();
  users.clear();
  console.log('All clients cleared');
};
