import { clients } from '../../session/session';
import sendResponsePacket from './createResponse';

export const broadCast = (tokens, packetType, message) => {
  tokens.forEach((token) => {
    const client = clients.get(token);
    sendResponsePacket(client, packetType, message);
  });
};
