import { PACKET_TYPE } from '../../constants/header.js';
import { createUser, findUserByUserID } from '../../db/user/user.db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const registerHandler = async (socket, payload) => {
  const { id, password, email } = payload;
  console.log(`id : ${id}, password : ${password}, email : ${email}`);

  let registerResponse;
  try {
    // 중복 계정이 있는지 확인하기

    // 계정 생성하기

    registerResponse = {
      success: true,
      message: '회원가입에 성공했습니다!',
    };
  } catch (err) {
    console.error(`검증오류: ${err}`);
  }

  sendResponsePacket(socket, registerResponse);
};
