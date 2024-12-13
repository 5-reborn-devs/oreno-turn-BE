import { redisManager } from '../../classes/managers/redis.manager.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getNextRoomId } from '../../session/room.session.js';
import { serverSwitch } from '../../utils/notification/notification.serverSwitch.js';
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
    const user = await redisManager.users.get(socket.token);

    // 여기서 방 번호 가ㅣ져와서 방 번호 할당
    const roomId = await getNextRoomId();
    const room = {
      id: roomId,
      ownerId: user.id,
      name: name,
      maxUserNum: maxUserNum,
      state: roomStateType.WAIT,
    };

    redisManager.rooms.addRoom(roomId, room); // 방 생성
    redisManager.rooms.addUser(roomId, user); // 방에 유저 추가
    // 레디스 유저 정보에 방정보 저장
    redisManager.users.setRoomId(socket.token, roomId);
    socket.roomId = roomId;

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
  socket.isEndIgnore = true;

  // 게임 서버 리스트를 받음.
  // 라운드로빈으로선정
  // 레디스에 해당 방의 IP를 저장.
  serverSwitch(socket, '127.0.0.1', 1666);
};
