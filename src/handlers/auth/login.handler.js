import { PACKET_TYPE } from '../../constants/header.js';
import { createUser, findUserByUserID } from '../../db/user/user.db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import Joi from 'joi';

export const login = async (socket, payload) => {
  console.log('test', payload);
  console.log('id', email);
  console.log('password', password);
};
