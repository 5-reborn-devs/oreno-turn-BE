import { clients } from './session';

export const addClient = (id, socket) => {
  clients.set(id, socket);
};

export const removeClient = (id) => {
  clients.delete(id);
};

export const clearClients = () => {
  clients.clear();
};
