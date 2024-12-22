import { redisManager } from '../../classes/managers/redis.manager.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { redisClient } from '../../init/redisConnect.js';
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
  let host, port;

  let createRoomResponse;
  try {
    const user = await redisManager.users.get(socket.token);
    if (user.roomId) {
      throw new Error(`이미 방에 들어가 있음 RoomId:${user.roomId}`);
    }

    const room = {
      id: 0,
      ownerId: user.id,
      name: name,
      maxUserNum: maxUserNum,
      state: roomStateType.WAIT,
    };

    if (user.roomId) {
      room.id = user.roomId;
      const joinRoomResponse = {
        success: true,
        room: room,
        failCode: failCode.NONE_FAILCODE,
      };

      sendResponsePacket(socket, PACKET_TYPE.JOIN_ROOM_RESPONSE, {
        joinRoomResponse,
      });

      throw new Error(`이미 방에 들어가 있음 RoomId:${user.roomId}`);
    }

    // 여기서 방 번호 가져와서 방 번호 할당
    const roomId = await getNextRoomId();
    room.id = roomId;

    if (user.roomId) {
      room.id = user.roomId;
      const joinRoomResponse = {
        success: true,
        room: room,
        failCode: failCode.NONE_FAILCODE,
      };

      sendResponsePacket(socket, PACKET_TYPE.JOIN_ROOM_RESPONSE, {
        joinRoomResponse,
      });

      throw new Error(`이미 방에 들어가 있음 RoomId:${user.roomId}`);
    }
    await redisManager.rooms.addRoom(roomId, room); // 방 생성
    await redisManager.rooms.addUser(roomId, user, socket.token); // 방에 유저 추가
    // 레디스 유저 정보에 방정보 저장
    await redisManager.users.setRoomId(socket.token, roomId);

    socket.gameIp = `${config.server.host}:1666`;
    console.log(socket.gameIp);
    // await redisManager.rooms.createRoom(roomId, room, socket.token);
    // 게임 서버 리스트를 받음.
    const gameServers = await redisClient.lrange('gameServers', 0, -1);
    // 라운드로빈으로선정
    const roundRobinCount = Number(await redisClient.get('roundRobin'));
    [host, port] = gameServers[roundRobinCount % gameServers.length].split(':');

    // JS가 처리할 수 있는 Number 범위
    if (roundRobinCount > 9007199254740990) {
      await redisClient.set('roundRobin', 1);
    } else {
      await redisClient.incr('roundRobin');
    }
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
};
