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

    // 패킷 데이터 전송 객체
    let registerResponse;

    // 닉네임 유효성 검사 (영어 대소문자, 숫자 조합 4~16자)
    const validationFields = schema.validate({ nickname, email, password });
    const validationFieldsError = validationFields.error;
 
    if (validationFieldsError) {
      console.error('Joi 인증 실패 에러: ', validationFieldsError.message);
      registerResponse = {
        success: false,
        message: validationFieldsError.message,
        failCode: failCode.INVALID_PHASE, // 로비서버에서 안쓰는 페일코드 이넘 맵핑
      };
    } 

    // 중복 계정 확인 : 해당 email을 가진 유저가 존재한다면
    const joinedUser = await findUserByUserEmail(email);
    if (joinedUser) {
      console.error('이미 등록된 아이디 입니다.');
      registerResponse = {
        success: false,
        message: '이미 등록된 아이디 입니다.',
        failCode: failCode.REGISTER_FAILED,
      };
    } 
    else if (!validationFieldsError) {
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

    console.log('보내기 전 패킷 확인: ', registerResponse)

    sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, {
      registerResponse,
    });
  } catch (err) {
    console.error(`검증오류: ${err}`);
  }
};
