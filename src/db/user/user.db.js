import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import dbPool from '../database.js';

export const findUserByUserEmail = async (email) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_USER_EMAIL, [
    email,
  ]);
  return toCamelCase(rows[0]);
};

export const createUser = async (nickname, password, email) => {
  await dbPool.query(SQL_QUERIES.CREATE_USER, [nickname, password, email]);
  return { nickname };
};

export const updateUserLogin = async (nickname) => {
  await dbPool.query(SQL_QUERIES.UPDATE_USER_LOGIN, [nickname]);
};

export const updateUserScore = async (userId) => {
  await dbPool.query(SQL_QUERIES.INCREASE_USER_WINS, [userId]);
};
