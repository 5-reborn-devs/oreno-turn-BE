import { clients } from '../../session/session';
import sendResponsePacket from './createResponse';

export const broadCast = (users, packetType, message) => {
  users.forEach((user) => {
    const client = clients.get(user.id);
    sendResponsePacket(client, packetType, message);
  });
};
