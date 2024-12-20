import { redisManager } from '../../classes/managers/redis.manager.js';
import User from '../../classes/models/user.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { clients } from '../../session/session.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const verifyTokenHandler = async (socket, payload) => {
  const failCode = getFailCode();
  const { token } = payload;
  let verifyTokenResponse;
  try {
    const user = await redisManager.users.get(token);
    if (Object.keys(user).length) {
      console.error('[verifyToken] token:', token);
      throw new Error('유효하지 않은 토큰');
    }
    console.log('verifyToken user:', user);
    const roomId = user.roomId;
    if (roomId) {
      throw new Error('방에 속한 유저');
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
  }

  await sendResponsePacket(socket, PACKET_TYPE.VERIFY_TOKEN_RESPONSE, {
    verifyTokenResponse,
  });
};
