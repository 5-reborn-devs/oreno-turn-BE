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
  let success = false;

  let createRoomResponse;
  try {
    const user = await redisManager.users.get(socket.token);
    if (user.roomId) {
      throw new Error(`이미 방에 들어가 있음 RoomId:${user.roomId}`);
    }

    // 여기서 방 번호 가져와서 방 번호 할당
    const roomId = await getNextRoomId();
    console.log('룸아이디', roomId);
    const room = {
      id: roomId,
      ownerId: user.id,
      name: name,
      maxUserNum: maxUserNum,
      state: roomStateType.WAIT,
    };

    await redisManager.rooms.addRoom(roomId, room); // 방 생성
    await redisManager.rooms.addUser(roomId, user, socket.token); // 방에 유저 추가
    // 레디스 유저 정보에 방정보 저장
    await redisManager.users.setRoomId(socket.token, roomId);
    socket.roomId = roomId;

    // await redisManager.rooms.createRoom(roomId, room, socket.token);

    socket.gameIp = `${config.server.host}:16666`;
    console.log(socket.gameIp);

    success = true;
    createRoomResponse = {
      success,
      room: room,
      failCode: failCode.NONE_FAILCODE,
    };
  } catch (error) {
    createRoomResponse = {
      success,
      room: null,
      failCode: failCode.CREATE_ROOM_FAILED,
    };

    console.error('방생성 실패: ', error);
  }

  sendResponsePacket(socket, PACKET_TYPE.CREATE_ROOM_RESPONSE, {
    createRoomResponse,
  });

  // 게임 서버 리스트를 받음.
  // 라운드로빈으로선정
  // 레디스에 해당 방의 IP를 저장.
  //if (success) serverSwitch(socket, '127.0.0.1', 16666);
  //   setTimeout(async () => {
  //     if (success) {
  //       serverSwitch(socket, config.server.host, 1666);
  //     }
  //   }, 1000);
};
