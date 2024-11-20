import { PACKET_TYPE } from '../../constants/header.js';
import { findUserByUserEmail } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import User from '../../classes/models/user.class.js';
import { getProtoMessages } from '../../init/loadProto.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { addClient } from '../../session/client.session.js';
import { addUser } from '../../session/user.session.js';

export const loginHandler = async (socket, payload) => {
  const { email, password } = payload;
  const protoMessages = getProtoMessages();
  const dbUser = await findUserByUserEmail(email);
  // 아이디 검사
  if (!dbUser) {
    console.log('아이디가 틀립니다.');
    const errorMessage = {
      success: false,
      message: `아이디가 틀립니다. ${email}`,
      token: '',
      userData: '',
      failCode: protoMessages.enum.GlobalFailCode.AUTHENTICATION_FAILED,
    };
    sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, { errorMessage }); //
    return;
  } else {
    // 비밀번호 검사
    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
    console.log('비번', password);
    console.log('디비비번', dbUser.password);

    if (!isPasswordCorrect) {
      console.log(`${password} : 비밀번호가 틀렸습니다.`);
      const errorMessage = {
        success: false,
        message: `비밀번호가 틀렸습니다. ${email}`,
        token: '',
        userData: '',
        failCode: protoMessages.enum.GlobalFailCode.AUTHENTICATION_FAILED,
      };
      sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, { errorMessage });
    } else {
      // 토큰 유효 시간
      const token = jwt.sign(dbUser, config.auth.key, { expiresIn: '1h' });
      socket.token = token;

      // 유저 세션에도 추가
      addClient(socket, email);

      const loginResponse = {
        success: true,
        message: `로그인 성공 ! ${email}`,
        token: token,
        userData: new User(email), // 캐릭터 선정 해준다 ?!
        failCode: protoMessages.enum.GlobalFailCode.NONE_FAILCODE,
      };
      sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, { loginResponse });

      addUser(token, loginResponse.userData);
    }
  }

  // 예를 들어서 const success = false; 처음 이렇게 해두고 if(비번이 옳을때) success=true;이렇게하고
  // const message = success ? '성공' : '실패'  << 이렇게하면 success가 true일때 성공 false이면 실패 이렇게 될거에요

  // 만료 시간 고민해보기
  // 만료 됐을 때
  // 유저 데이터
  // 로그인 검증
  // 세션에 잘 들어왔는지

  // 1. sendResponsePacket을 한번 적고서도 작동하게끔 만들어라.$
  // 2. register에 joi 스키마를 utils 따로 만들어서 들고 오자.
  // 3. login에 try-catch를 사용해서 오류에 대응하자
  // 4. 만약에 import 해놓고 안쓰는 함수는 지우기 -> import 정리
  // 5. addUser 함수를 client.session에 정리한 것은 좋지 않다 user.session에 정리하자.
};
