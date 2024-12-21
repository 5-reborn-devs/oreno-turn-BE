import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { users } from '../../session/session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const switchHandler = (socket) => {
  const ip = config.server.host;
  const port = 9000;

  const switchResponse = { ip, port };
  sendResponsePacket(socket, PACKET_TYPE.SWITCH_RESPONSE, {
    switchResponse,
  });
};
