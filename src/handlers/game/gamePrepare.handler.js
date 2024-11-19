import { rooms } from '../../session/session.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';

export const gamePrepare = (socket) => {
  let gamePrePareResponse;
  try {
    const roomId = socket.roomId; // socket.roomId로 통일
    const room = rooms.get(roomId);
    // 본인은 빼는 로직을 추가해도 될 것같음
    const usersInRoom = [...room.users];

    gamePrePareResponse = {
      success: true,
      failcode: failCode.NONE_FAILCODE,
    };
    multiCast(usersInRoom, PACKET_TYPE.GAME_PREPARE_NOTIFICATION, room);
  } catch (err) {
    gamePrePareResponse = {
      success: false,
      failcode: failCode.UNKNOWN_ERROR,
    };
    console.err(err);
  }
  sendResponsePacket(
    socket,
    PACKET_TYPE.GAME_PREPARE_RESPONSE,
    gamePrePareResponse,
  );
};
