import { PACKET_TYPE } from '../../constants/header.js';
import { findUserByUserEmail } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import User from '../../classes/models/user.class.js';
import { getProtoMessages } from '../../init/loadProto.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { addClient } from '../../session/client.session.js';
import { addUser, userLoggedIn } from '../../session/user.session.js';

export const loginHandler = async (socket, payload) => {
  try {
    const { email, password } = payload;
    const protoMessages = getProtoMessages();

    // 패킷 데이터 전송 객체
    let response = {
      success: false,
      message: '',
      failCode: protoMessages.enum.GlobalFailCode.REGISTER_FAILED,
  }

    // 중복 로그인 확인
    if (userLoggedIn(email)) {
      console.log(`이미 로그인된 사용자 입니다. : ${email}`);
      response = {
        success: false,
        message: `이미 로그인된 사용자 입니다. : ${email}`,
        token: '',
        myInfo: '',
        failCode: protoMessages.enum.GlobalFailCode.AUTHENTICATION_FAILED,
      };
    }

    const dbUser = await findUserByUserEmail(email);

    // 아이디 검사
    if (!dbUser) {
      console.log('아이디가 틀립니다.');
      response = {
        success: false,
        message: ` ${email} : 아이디가 틀립니다.`,
        token: '',
        myInfo: '',
        failCode: protoMessages.enum.GlobalFailCode.AUTHENTICATION_FAILED,
      };
    } else {
      // 비밀번호 검사
      const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
      console.log('비번', password);
      console.log('디비비번', dbUser.password);

      if (!isPasswordCorrect) {
        console.log(`${password} : 비밀번호가 틀렸습니다.`);
        response = {
          success: false,
          message: `비밀번호가 틀렸습니다. ${email}`,
          token: '',
          myInfo: '',
          failCode: protoMessages.enum.GlobalFailCode.AUTHENTICATION_FAILED,
        };
      }
      else {
        // 토큰 유효 시간
        const token = jwt.sign(dbUser, config.auth.key, { expiresIn: '12h' });

        response = {
          success: true,
          message: `로그인 성공 ! ${email}`,
          token: token,
          myInfo: new User(email),
          failCode: protoMessages.enum.GlobalFailCode.NONE_FAILCODE,
        };
        addClient(socket, email);
        addUser(token, response.myInfo);
      }
    }
    console.log('response 메세지 : ', response);
    sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, { loginResponse: response, });
  } catch (err) {
    console.log(err);
  }

  // 1. sendResponsePacket을 한번 적고서도 작동하게끔 만들어라.
};