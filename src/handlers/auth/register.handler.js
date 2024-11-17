import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { createUser, findUserByEmail } from '../../db/user/user.db.js';
import { v4 as uuidv4 } from 'uuid'; 
import bcrypt from 'bcrypt'
import Joi from 'joi';


export const register = async () => {

};