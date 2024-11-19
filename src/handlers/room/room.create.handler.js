import Room from '../../classes/models/room.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { rooms, users } from '../../session/session.js';
import { serializer } from '../../utils/serilaizer.js';

let count = 0;

export const createRoomHandler = async (socket, payloadData) => {
  const protoMessages = getProtoMessages();
  const failCode = protoMessages.enum.GlobalFailCode;
  let message;
  try {
    const token = socket.token;
    const { name, maxUserNum } = payloadData;
    const userData = users.get(token);
    const usersInRoom = [userData];

    const roomData = new Room(
      count,
      userData.id,
      name,
      maxUserNum,
      0,
      usersInRoom,
    );

    rooms.set(count, roomData); // 방 세션에 생성
    count++; // roomId 증가

    message = {
      success: true,
      room: roomData,
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

  const response = protoMessages.gamePacket.GamePacket;
  const packet = response.encode({ createRoomResponse: message }).finish();
  socket.write(serializer(packet, PACKET_TYPE.CREATE_ROOM_RESPONSE));

  return roomData;
};
