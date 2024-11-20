import Room from '../../classes/models/room.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { joinRoomHandler } from './room.join.handler.js';

let count = 0;

export const createRoomHandler = async (socket, payloadData) => {
  const { name, maxUserNum } = payloadData;
  const failCode = getFailCode();

  let createRoomResponse;
  try {
    const user = users.get(socket.token);
    const usersInRoom = [user];
    const room = new Room(count, user.id, name, maxUserNum, 0, usersInRoom);
    console.log(JSON.stringify(room));

    rooms.set(count, room); // 방 세션에 생성
    socket.roomId = count;
    count++; // roomId 증가
    console.log(JSON.stringify([...rooms.keys()]));

    createRoomResponse = {
      success: true,
      room: room,
      failCode: failCode.NONE_FAILCODE,
    };

    console.log(failCode);
    console.log(createRoomResponse);
  } catch (error) {
    createRoomResponse = {
      success: false,
      room: null,
      failCode: failCode.CREATE_ROOM_FAILED,
    };

    console.error('방생성 실패: ', error);
  }

  // joinRoomHandler(socket, { roomId: 0 });
  sendResponsePacket(socket, PACKET_TYPE.CREATE_ROOM_RESPONSE, {
    createRoomResponse,
  });
};
