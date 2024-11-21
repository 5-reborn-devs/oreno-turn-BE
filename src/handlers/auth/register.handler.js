import { PACKET_TYPE } from '../../constants/header.js';
import { createUser, findUserByUserEmail } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import { getProtoMessages } from '../../init/loadProto.js';
import schema from '../../utils/validation/validation.js';

export const registerHandler = async (socket, payload) => {
    try {
        const protoMessages = getProtoMessages();
        const { password, nickname, email } = payload;
        console.log(`id : ${email}, password(nickname) : ${nickname}, password_re(password) : ${password} `);

        // 패킷 데이터 전송 객체
        let response = {
            success: false,
            message: '',
            failCode: protoMessages.enum.GlobalFailCode.REGISTER_FAILED,
        }

        const validation = schema.validate({ email });
        const validationError = validation.error;

        // 이메일 유효성 검사
        if (validationError) {
            console.log('이메일을 정확하게 입력해주세요.');
            response = {
                success: false,
                message: '이메일을 정확하게 입력해주세요.',
                failCode: protoMessages.enum.GlobalFailCode.REGISTER_FAILED,
            }
        };

        // 중복 계정 확인 : 해당 email을 가진 유저가 존재한다면
        const joinedUser = await findUserByUserEmail(email);

        if (joinedUser) {
            response = {
                success: false,
                message: '이미 아이디가 존재합니다.',
                failCode: protoMessages.enum.GlobalFailCode.REGISTER_FAILED,
            };
        } else {
            // 계정 생성하기
            response = {
                success: true,
                message: 'register success',
                failCode: protoMessages.enum.GlobalFailCode.NONE_FAILCODE,
            };

            const bcryptPassword = await bcrypt.hash(password, 10); // 비밀번호 암호화
            await createUser(nickname, bcryptPassword, email);
        }

        console.log('response 메세지 : ', response);
        sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, { registerResponse: response, });
    } catch (err) {
        console.error(`검증오류: ${err}`);
    }
};
