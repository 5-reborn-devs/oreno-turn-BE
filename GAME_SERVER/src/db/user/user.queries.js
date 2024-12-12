export const SQL_QUERIES = {
  FIND_USER_BY_USER_EMAIL: 'SELECT * FROM user WHERE email = ?',
  CREATE_USER: 'INSERT INTO user (nickname, password, email) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN:
    'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE nickname = ?',
  INCREASE_USER_WINS: 'UPDATE user SET wins = wins + 1 WHERE nickname = ? ',
};
