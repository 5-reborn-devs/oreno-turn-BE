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
  const { token } = payload; // 그 유저의 토큰을 가져옴
  let verifyTokenResponse;
  try {
    // 토큰 확인
    console.log('[verifyToken] token:', token);
    // 토큰 기반으로 레디스에서 유저정보를 가져옴
    const user = await redisManager.users.get(token);
    // 유저를 못찾으면 오류
    if (!user || !Object.keys(user).length) {
      console.error('[verifyToken] token:', token);
      console.error('Returned user object:', user);
      throw new Error('유효하지 않은 토큰');
    }
    // 잘들고왔는지 확인함
    console.log('verifyToken user:', user);

    // 새로 연결됬으므로 소켓에 토큰 다시 넣어줌
    socket.token = token;
    // 로비서버로 돌아왔으므로 clients 세션에 유저를 넣어줌
    clients.set(Number(user.id), socket);

    verifyTokenResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };
    console.log('로비서버로 다시 연결됨!');
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
