import { PACKET_TYPE } from '../../constants/header.js';
import { createUser, findUserByUserEmail } from '../../db/user/user.db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import { getProtoMessages } from '../../init/loadProto.js';

export const registerHandler = async (socket, payload) => {
    try {
        const protoMessages = getProtoMessages();
        const { password, nickname, email } = payload;
        console.log(`id : ${email}, password(nickname) : ${nickname}, password_re(password) : ${password} `);

        // 검증을 위한 객체 선언
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        const validation = schema.validate({ email });
        const validationError = validation.error;

        // SELECT * FROM user;
            // 우리 테이블 이름은 다르다. 테이블 이름을 알려면 어디서 찾아야할까?
            // 테이블을 잘 못 적은게 아닐 수도 있다 오류 메세지를 살펴보자

        console.log(validationError);

        // 이메일 유효성 검사
        if (validationError) {
            console.log('이메일을 정확하게 입력해주세요.');
            const errorMessage = {
                registerResponse: {
                    success: false,
                    message: '이메일을 정확하게 입력해주세요.',
                    failCode: protoMessages.enum.GlobalFailCode.REGISTER_FAILED,
                }
            }
            sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, { errorMessage, });
            return;
        };

        // 중복 계정 확인 : 해당 email을 가진 유저가 존재한다면
        const joinedUser = await findUserByUserEmail(email);

        if (joinedUser) {
            const errorMessage = {
                success: false,
                message: '이미 아이디가 존재합니다.',
                failCode: protoMessages.enum.GlobalFailCode.REGISTER_FAILED,
            };

            sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, { errorMessage, });
            return;
        } else {
            // 계정 생성하기
            const registerResponse = {
                success: true,
                message: 'register success',
                failCode: protoMessages.enum.GlobalFailCode.NONE_FAILCODE,
            };

            const bcryptPassword = await bcrypt.hash(password, 10); // 비밀번호 암호화
            await createUser(nickname, bcryptPassword, email);
            sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, { registerResponse, });
            return;
        }

    } catch (err) {
        console.error(`검증오류: ${err}`);
    }
};
