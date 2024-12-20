import { PACKET_TYPE } from '../../constants/header.js';
import { createUser, findUserByUserEmail } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import schema from '../../utils/validation/validation.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const registerHandler = async (socket, payload) => {
  try {
    const failCode = getFailCode();
    const { password, nickname, email } = payload;

    console.log(`클라에서 준 nickname : ${nickname}`);
    console.log(`클라에서 준 email : ${email}`);
    console.log(`클라에서 준 password : ${password}`);

    // 패킷 데이터 전송 객체
    let registerResponse;

    // 닉네임 유효성 검사 (영어 대소문자, 숫자 조합 4~16자)
    const validationNickname = schema.validate({ nickname });
    const validationNicknameError = validationNickname.error;
    if (validationNicknameError) {
      console.log('닉네임은 영어 대소문자, 숫자 조합 4~16자로 작성해주세요.');
      registerResponse = {
        success: false,
        message: '닉네임은 영어 대소문자, 숫자 조합 4~16자로 작성해주세요.',
        failCode: failCode.INVALID_PHASE, // 로비서버에서 안쓰는 페일코드 이넘 맵핑
      };
    }

    // 이메일 유효성 검사
    const validationEmail = schema.validate({ email });
    const validationEmailError = validationEmail.error;
    if (validationEmailError) {
      console.log('이메일을 정확하게 입력해주세요.');
      registerResponse = {
        success: false,
        message: '이메일을 정확하게 입력해주세요.',
        failCode: failCode.CHARACTER_CONTAINED, // 로비서버에서 안쓰는 페일코드 이넘 맵핑
      };
    }

    // 중복 계정 확인 : 해당 email을 가진 유저가 존재한다면
    const joinedUser = await findUserByUserEmail(email);
    if (joinedUser) {
      console.log('이미 아이디가 존재합니다.');
      registerResponse = {
        success: false,
        message: '이미 아이디가 존재합니다.',
        failCode: failCode.REGISTER_FAILED,
      };
    } else if (!validationEmailError) {
      // 계정 생성하기
      registerResponse = {
        success: true,
        message: 'register success',
        failCode: failCode.NONE_FAILCODE,
      };

      // 비밀번호 암호화
      const bcryptPassword = await bcrypt.hash(password, 10);
      await createUser(nickname, bcryptPassword, email);
    }

    sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, {
      registerResponse,
    });
  } catch (err) {
    console.error(`검증오류: ${err}`);
  }
};
