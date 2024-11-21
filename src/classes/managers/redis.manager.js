import { redisClient } from '../../init/redisConnect';

export const RedisManager = {
  addUser: async (user) => {
    try {
      const userData = {
        socket: user.socket,
        userId: user.id,
        wins: user.wins,
        jwt: user.socket.token,
      };

      // Redis에 Hash 형식으로 저장
      await redisClient.hmset(`user:${user.userId}`, userData);

      await redisClient.set(`socket:${user.socket.id}`, user.id);
      console.log(`유저 정보가 Redis에 저장되었습니다: user:${user.userId}`);
    } catch (error) {
      console.error('Redis에 유저 정보 저장 중 오류 발생:', error);
    }
  },

  getUser: async (userId) => {
    try {
      // Redis에서 저장된 유저 데이터를 가져옴
      const userData = await redisClient.hgetall(`user:${userId}`);
      if (Object.keys(userData).length === 0) {
        console.log(`유저 정보가 Redis에 존재하지 않습니다: user:${userId}`);
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Redis에서 유저 정보 불러오기 중 오류 발생:', error);
      return null;
    }
  },

  getUserIdBySocket: async (socket) => {
    try {
      const userId = await redisClient.get(`socket:${socket.id}`);
      if (!userId) {
        console.log(`socket:${socket.id}에 대한 userId를 찾을 수 없습니다.`);
        return null;
      }
      return userId;
    } catch (error) {
      console.error(`socket:${socket.id}에 대한 userId를 찾을 수 없습니다.`);
      return null;
    }
  },
};
