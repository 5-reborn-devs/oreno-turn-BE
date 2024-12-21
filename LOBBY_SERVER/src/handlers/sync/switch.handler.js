import { PACKET_TYPE } from '../../constants/header.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const switchHandler = (socket) => {
  const [ip, port] = socket.gameIp.split(':');

  socket.isEndIgnore = true;
  const switchResponse = { ip, port };
  sendResponsePacket(socket, PACKET_TYPE.Swtich_Response, {
    switchResponse,
  });
};
