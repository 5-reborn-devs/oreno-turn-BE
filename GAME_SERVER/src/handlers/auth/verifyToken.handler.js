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
    const userRoomPort = socket._server._connectionKey; // 소켓에서 유저 host port 뽑아 옴
    const roomPort = userRoomPort.split(':').pop(); // 포트만 가져옴
    const user = await redisManager.users.get(token);
    if (!user) {
      throw new Error('유효하지 않은 토큰');
    }
    console.log('verifyToken user:', user);
    const roomId = user.roomId;
    await redisClient.hset(roomId, 'roomPort', roomPort); // redis roomId에 roomPort넣어줌
    if (!roomId) {
      throw new Error('방에 속하지 않은 유저');
    }

    socket.token = token;
    socket.roomId = roomId;
    clients.set(Number(user.id), socket);

    // const room = await redisManager.rooms.getRoom(roomId);
    // 방장이 아니라면 참가를 알림
    const usersInRoom = await redisManager.rooms.getUsers(roomId);
    const joinRoomNotification = {
      joinUser: new User(Number(user.id), user.nickname),
    };
    addUser(socket.token, joinRoomNotification.joinUser);
    console.log('verifyToken users:', usersInRoom);
    multiCast(usersInRoom, PACKET_TYPE.JOIN_ROOM_NOTIFICATION, {
      joinRoomNotification,
    });
    verifyTokenResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };
    console.log('다시 연결됨!');
  } catch (error) {
    verifyTokenResponse = {
      success: false,
      failCode: failCode.INVALID_REQUEST,
    };
    console.error(error);
    console.error(`token:${socket.token}, roomId:${socket.roomId}`);
  }
  sendResponsePacket(socket, PACKET_TYPE.VERIFY_TOKEN_RESPONSE, {
    verifyTokenResponse,
  });
};
