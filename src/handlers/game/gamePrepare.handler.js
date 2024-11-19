import { rooms } from '../../session/session.js';
import { multiCast } from '../../utils/response/createResponse.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const gamePrepare = (socket) => {
  let gamePrePareResponse;
  try {
    const roomId = socket.roomId; // socket.roomId로 통일
    const room = rooms.get(roomId);

    multiCast(usersInRoom, PACKET_TYPE.GAME_PREPARE_NOTIFICATION, room);
    gamePrePareResponse = {
      success: true,
      failcode: failCode.NONE_FAILCODE,
    };
  } catch (err) {
    gamePrePareResponse = {
      success: false,
      failcode: failCode.UNKNOWN_ERROR,
    };
  }
  sendResponsePacket(
    socket,
    PACKET_TYPE.GAME_PREPARE_RESPONSE,
    gamePrePareResponse,
  );
};
