import { PACKET_TYPE } from '../../constants/header.js';
import sendResponsePacket from '../response/createResponse.js';

export const serverSwitch = (socket, ip, port) => {
  socket.isEndIgnore = true;
  const gameServerSwitchNotification = { ip, port };
  sendResponsePacket(socket, PACKET_TYPE.GAME_SERVER_SWITCH_NOTIFICATION, {
    gameServerSwitchNotification,
  });
};
