import Room from '../../classes/models/room.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getNextRoomId } from '../../session/room.session.js';
import { rooms, users } from '../../session/session.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

// let count = 1; // set 사용 고려해보기

export const createRoomHandler = async (socket, payloadData) => {
  const protoMessages = getProtoMessages();
  const roomStateType = protoMessages.enum.RoomStateType.values;
  const { name, maxUserNum } = payloadData;
  const failCode = getFailCode();

  let createRoomResponse;
  try {
    const user = users.get(socket.token);
    const usersInRoom = [user];

    // 여기서 방 번호 가ㅣ져와서 방 번호 할당
    const roomId = getNextRoomId();

    const room = new Room(
      //count,
      roomId,
      user.id,
      name,
      maxUserNum,
      roomStateType.WAIT,
      usersInRoom,
    );

    rooms.set(roomId, room); // 방 세션에 생성
    socket.roomId = roomId;
    //count++; // roomId 증가

    createRoomResponse = {
      success: true,
      room: room,
      failCode: failCode.NONE_FAILCODE,
    };
  } catch (error) {
    createRoomResponse = {
      success: false,
      room: null,
      failCode: failCode.CREATE_ROOM_FAILED,
    };

    console.error('방생성 실패: ', error);
  }

  sendResponsePacket(socket, PACKET_TYPE.CREATE_ROOM_RESPONSE, {
    createRoomResponse,
  });
};
