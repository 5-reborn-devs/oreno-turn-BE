import { rooms } from '../../session/session.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';

export const gamePrepare = (socket) => {
  let gamePrePareResponse;
  try {
    const roomId = socket.roomId; // socket.roomId로 통일
    const room = rooms.get(roomId); // 클라이언트가 들어가 있는 방정보를 가져옴
    const usersInRoom = [...room.users]; // 방 안에 있는 모든 유저들의 정보를 가져옴

    const notification = {};

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
  sendResponsePacket(socket, PACKET_TYPE.GAME_PREPARE_RESPONSE, {
    gamePrePareResponse,
  });
};
