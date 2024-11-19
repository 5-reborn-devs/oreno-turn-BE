import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import dbPool from '../database.js';

// 왜 리스트에 넣었다가 [0]로 빼는 것일까..
export const findUserByUserEmail = async (userEmail) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_USER_EMAIL, [userEmail]);
  return toCamelCase(rows[0]);
};

export const createUser = async (userId, password, email) => {
  await dbPool.query(SQL_QUERIES.CREATE_USER, [userId, password, email]);
  return { userId };
};

export const updateUserLogin = async (userId) => {
  await dbPool.query(SQL_QUERIES.UPDATE_USER_LOGIN, [userId]);
};

export const updateUserScore = async (userId) => {
  await dbPool.query(SQL_QUERIES.INCREASE_USER_WINS, [userId]);
};
