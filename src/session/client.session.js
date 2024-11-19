import { clients, users } from './session.js';

export const addClient = (email, socket, token) => {
  clients.set(socket, token);
  users.set(socket, token);
};

export const removeClient = (email) => {
  clients.delete(email);
};

export const clearClients = () => {
  clients.clear();
  users.clear();
  console.log('All clients cleared');
};