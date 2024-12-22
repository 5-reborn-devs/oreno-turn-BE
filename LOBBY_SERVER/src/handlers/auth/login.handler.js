import { PACKET_TYPE } from '../../constants/header.js';
import { findUserByUserEmail } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import User from '../../classes/models/user.class.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { addClient } from '../../session/client.session.js';
import { addUser, userLoggedIn } from '../../session/user.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { redisManager } from '../../classes/managers/redis.manager.js';
import { redisClient } from '../../init/redisConnect.js';

function sendErrorMessage(response, message) {
  console.error(message);
  response.message = message;
  throw new Error(message);
}

export const loginHandler = async (socket, payload) => {
  const { email, password } = payload;
  const failCode = getFailCode();

  // 패킷 데이터 전송 객체
  let loginResponse = {
    success: false,
    message: '',
    token: '',
    myInfo: '',
    failCode: failCode.AUTHENTICATION_FAILED,
  };
  try {
    // 아이디 검사
    const dbUser = await findUserByUserEmail(email);
    if (!dbUser)
      sendErrorMessage(loginResponse, `${email} : 아이디가 틀립니다.`);

    // 비밀번호 검사
    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordCorrect)
      sendErrorMessage(loginResponse, `비밀번호가 틀렸습니다. ${email}`);

    // 중복 로그인 확인
    if (await redisClient.sismember('users', dbUser.userId))
      sendErrorMessage(
        loginResponse,
        `이미 로그인된 사용자 입니다. : ${email}`,
      );

    //토큰 발급
    const token = jwt.sign(dbUser, config.auth.key, { expiresIn: '12h' });
    socket.token = token;

    const user = new User(dbUser.userId, dbUser.nickname);
    console.log('테스트용', user);
    //클라이언트 세션 추가
    addClient(socket, dbUser.userId);
    loginResponse = {
      success: true,
      message: `로그인 성공 ! ${email}`,
      token: token,
      myInfo: user,
      failCode: failCode.NONE_FAILCODE,
    };

    // 유저 세션에 사용자 추가
    redisManager.users.add(token, user);
  } catch (err) {
    console.log(err);
  }

  sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, {
    loginResponse,
  });
};
