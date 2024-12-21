import { PACKET_TYPE } from '../../constants/header';
import sendResponsePacket from '../../utils/response/createResponse';

export const switchHandler = (socket) => {
  const [ip, port] = socket.gameIp.split(':');

  socket.isEndIgnore = true;
  const switchResponse = { ip, port };
  sendResponsePacket(socket, PACKET_TYPE.Swtich_Response, {
    switchResponse,
  });
};
