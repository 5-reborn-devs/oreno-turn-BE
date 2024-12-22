import { redisManager } from '../../classes/managers/redis.manager.js';
import User from '../../classes/models/user.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { redisClient } from '../../init/redisConnect.js';
import { clients, users } from '../../session/session.js';
import { addUser } from '../../session/user.session.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const verifyTokenHandler = async (socket, payload) => {
  const failCode = getFailCode();
  const { token } = payload;
  let verifyTokenResponse;
  try {
    // 이거 됨
    const userRoomPort = socket._server._connectionKey; // 소켓에서 유저 host port 뽑아 옴
    // 토큰을 가져와서 redis에서 유저정보를 가져온다. 검증됨
    console.log('verify에서 userRoomPort : ', userRoomPort);
    const roomPort = userRoomPort.split(':').pop(); // 포트만 가져옴
    console.log('분리된 roomPort : ', roomPort);

    // 토큰을 가져와서 redis에서 유저정보를 가져온다. 검증됨
    const user = await redisManager.users.get(token);
    // 없으면 오류 나는곳
    if (!Object.keys(user).length) {
      console.error('[verifyToken] token:', token);
      console.error('user', user);
      throw new Error('유효하지 않은 토큰');
    }
    console.log('verifyToken user:', user);
    // 룸아이디를 가져옴
    const roomId = user.roomId; // 1
    if (!roomId) {
      throw new Error('방에 속하지 않은 유저');
    }
    // 검증됨
    await redisClient.hset(roomId, 'roomPort', roomPort); // redis roomId에 roomPort넣어줌
    // 소켓에다가 다시 토큰 넣어줌
    socket.token = token;
    // 검증됨
    socket.roomId = roomId;
    // 세션에 넣어줌
    clients.set(Number(user.id), socket);

    // const room = await redisManager.rooms.getRoom(roomId);
    // 방장이 아니라면 참가를 알림
    // 레디스에서 유저들 정보를 가져옴 검증됨 (user번호를 들고옴)
    const usersInRoom = await redisManager.rooms.getUsers(roomId);
    // 조인룸노티를 만듬
    const joinRoomNotification = {
      joinUser: new User(Number(user.id), user.nickname),
    };
    // 게임서버 유저 세션에 추가해 줌
    addUser(socket.token, joinRoomNotification.joinUser);
    console.log('먼저 방에 있던 유저들:', usersInRoom);
    await multiCast(usersInRoom, PACKET_TYPE.JOIN_ROOM_NOTIFICATION, {
      joinRoomNotification,
    });
    verifyTokenResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };
    console.log('게임 서버로 연결됨!');
  } catch (error) {
    verifyTokenResponse = {
      success: false,
      failCode: failCode.INVALID_REQUEST,
    };
    console.error(error);
    console.error(`token:${socket.token}, roomId:${socket.roomId}`);
  }
  await sendResponsePacket(socket, PACKET_TYPE.VERIFY_TOKEN_RESPONSE, {
    verifyTokenResponse,
  });
};
