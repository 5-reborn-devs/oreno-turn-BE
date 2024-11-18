import { PACKET_TYPE } from '../../constants/header.js';
import { createUser, findUserByUserID } from '../../db/user/user.db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { getProtoMessages } from '../../init/loadProto.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import User from '../../classes/models/user.class.js';

export const login = async (socket, payload) => {
  const { email, nickname, password } = payload;
  const protoMesages = getProtoMessages();
  console.log('id', email);
  console.log('password', password);
  const user = new User(email, nickname);
  const loginResponse = {
    success: true,
    message: '회원가입에 성공했습니다!',
    token: 'good',
    UserData: user,
    failCode: protoMesages.enum.GlobalFailCode.NONE_FAILCODE,
  };
  sendResponsePacket(socket, PACKET_TYPE.LOGIN_RESPONSE, {
    loginResponse,
  });
};
