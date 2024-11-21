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

export const loginHandler = async (socket, payload) => {
  try {
    const { email, password } = payload;
    const failCode = getFailCode();

    // 패킷 데이터 전송 객체
    let loginResponse;

    // 중복 로그인 확인
    if (userLoggedIn(email)) {
      console.log(`이미 로그인된 사용자 입니다. : ${email}`);
      loginResponse = {
        success: false,
        message: `이미 로그인된 사용자 입니다. : ${email}`,
        token: '',
        myInfo: '',
        failCode: failCode.AUTHENTICATION_FAILED,
      };
      return sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, { loginResponse, });
    }

    // 아이디 검사
    const dbUser = await findUserByUserEmail(email);
    if (!dbUser) {
      console.log('아이디가 틀립니다.');
      loginResponse = {
        success: false,
        message: ` ${email} : 아이디가 틀립니다.`,
        token: '',
        myInfo: '',
        failCode: failCode.AUTHENTICATION_FAILED,
      };
      return sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, { loginResponse, });
    }

    // 비밀번호 검사
    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
    console.log('비번', password);
    console.log('디비비번', dbUser.password);

    if (!isPasswordCorrect) {
      console.log(`${password} : 비밀번호가 틀렸습니다.`);
      loginResponse = {
        success: false,
        message: `비밀번호가 틀렸습니다. ${email}`,
        token: '',
        myInfo: '',
        failCode: failCode.AUTHENTICATION_FAILED,
      };
      return sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, { loginResponse, });
    }

    //토큰 발급 
    const token = jwt.sign(dbUser, config.auth.key, { expiresIn: '12h' });

    //클라이언트 세션 추가
    addClient(socket, email);

    loginResponse = {
      success: true,
      message: `로그인 성공 ! ${email}`,
      token: token,
      myInfo: new User(email),
      failCode: failCode.NONE_FAILCODE,
    };

    // session에 사용자 추가
    addUser(token, loginResponse.myInfo);

    return sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, { loginResponse, });
    
  } catch (err) {
    console.log(err);
  }
};

