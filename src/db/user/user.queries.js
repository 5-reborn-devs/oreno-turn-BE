export const SQL_QUERIES = {
  FIND_USER_BY_USER_ID: 'SELECT * FROM user WHERE user_id = ?',
  CREATE_USER: 'INSERT INTO user (user_id, password, email) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN:
    'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
  INCREASE_USER_WINS: 'UPDATE user SET wins = wins + 1 WHERE user_id = ? ',
};
