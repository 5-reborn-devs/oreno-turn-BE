import Room from '../../classes/models/room.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

let count = 0;

export const createRoomHandler = async (socket, payloadData) => {
  const { name, maxUserNum } = payloadData;
  const failCode = getFailCode();

  let message;
  try {
    const user = users.get(socket.token);
    const usersInRoom = [user];

    const room = new Room(count, user.id, name, maxUserNum, 0, usersInRoom);

    rooms.set(count, room); // 방 세션에 생성
    socket.roomId = count;
    count++; // roomId 증가

    message = {
      success: true,
      room: room,
      failCode: failCode.NONE_FAILCODE,
    };
  } catch (error) {
    message = {
      success: false,
      room: null,
      failCode: failCode.CREATE_ROOM_FAILED,
    };

    console.error('방생성 실패: ', error);
  }

  sendResponsePacket(socket, PACKET_TYPE.CREATE_ROOM_RESPONSE, message);
};
