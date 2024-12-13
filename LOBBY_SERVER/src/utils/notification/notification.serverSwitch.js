import { PACKET_TYPE } from '../../constants/header.js';
import sendResponsePacket from '../response/createResponse.js';

export const serverSwitch = (socket, ip, port) => {
  const gameServerSwitchNotification = { ip, port };
  console.log('서버스위치에서 아이피랑 포트', ip, port);
  sendResponsePacket(socket, PACKET_TYPE.GAME_SERVER_SWITCH_NOTIFICATION, {
    gameServerSwitchNotification,
  });
};
