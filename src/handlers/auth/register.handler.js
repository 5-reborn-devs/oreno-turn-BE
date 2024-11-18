import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { createUser, findUserByEmail } from '../../db/user/user.db.js';
import { v4 as uuidv4 } from 'uuid'; 
import bcrypt from 'bcrypt'
import Joi from 'joi';


export const registerHandler = async (socket, payload) => {

    try {
        const { email, password } = await joiUtils.validateRegister(payload);

        // db에서 중복 아이디 찾기

        // db에서 아이디 생성하기

        const registerResponse = {
            success: true,
            message: '회원가입에 성공했습니다!',
        };

        const response = createResponse(registerResponse);

        socket.write(response);
    } catch (e){
        handleError(socket, e);
    }

};