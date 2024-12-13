import { redisClient } from '../../init/redisConnect.js';
import { clients } from '../../session/session.js';

export const redisManager = {
  users: {
    add: async (token, user) => {
      try {
        const userData = {
          id: user.id,
          nickname: user.nickname,
        };
        // Redis에 Hash 형식으로 저장
        await redisClient.hmset(token, userData);
      } catch (error) {
        console.error('Redis에 유저 정보 저장 중 오류 발생:', error);
      }
    },

    get: async (token) => {
      // Redis에서 저장된 유저 데이터를 가져옴
      const user = await redisClient.hgetall(token);
      if (!user) {
        console.log(`유저 정보가 Redis에 존재하지 않습니다`);
        return null;
      }
      return user;
    },

    delete: async (key) => {
      await redisClient.del(key);
    },

    setRoomId: async (token, roomId) => {
      await redisClient.hset(token, 'roomId', roomId);
    },

    delRoomId: async (token) => {
      await redisClient.hdel(token, 'roomId');
    },
  },

  rooms: {
    addRoom: async (roomId, data) => {
      const pipeline = redisClient.pipeline();
      pipeline.hset(roomId, data);
      pipeline.sadd('rooms', roomId);
      await pipeline.exec();
    },

    getRoom: async (roomId) => {
      return await redisClient.hgetall(roomId);
    },

    getRooms: async () => {
      const roomIds = await redisClient.smembers('rooms');
      return await Promise.all(
        roomIds.map(async (roomId) => {
          const room = await redisClient.hgetall(roomId);
          room.users = await redisClient.smembers(`${roomId}:users`);
          return room;
        }),
      );
    },

    getEmptyRooms: async () => {
      const roomIds = await redisClient.smembers('rooms');
      console.log('roomIds', roomIds);
      return await Promise.all(
        roomIds.filter(async (roomId) => {
          const maxUserNum = await redisClient.hget(roomId, 'maxUserNum');
          const users = await redisClient.smembers(`${roomId}:users`);
          return users.length < maxUserNum;
        }),
      );
    },

    delete: async (roomId) => {
      const pipeline = redisClient.pipeline();
      pipeline.del(roomId);
      pipeline.del(`${roomId}:users`);
      pipeline.srem('rooms', roomId);
      await pipeline.exec();
    },

    addUser: async (roomId, user) => {
      await redisClient.sadd(`${roomId}:users`, user.id);
    },

    removeUser: async (roomId, user) => {
      await redisClient.srem(`${roomId}:users`, user.id);
    },

    getUsers: async (roomId) => {
      return await redisClient.smembers(`${roomId}:users`);
    },

    getUser: async (roomId, user) => {
      return await redisClient.sismember(`${roomId}:users`, user.id);
    },

    getUsersData: async (roomId) => {
      const userIds = await redisClient.smembers(`${roomId}:users`);
      return await Promise.all(
        userIds.map(async (id) => {
          const token = clients.get(Number(id)).token;
          return await redisClient.hgetall(token);
        }),
      );
    },

    getRoomData: async (roomId) => {
      const room = await redisClient.hgetall(roomId);
      const userIds = await redisClient.smembers(`${roomId}:users`);
      const userIdsInt = userIds.map(Number);
      console.log('클라이언트', clients);
      room.users = await Promise.all(
        userIdsInt.map(async (id) => {
          const token = clients.get(Number(id)).token;
          console.log('토큰', token);
          return await redisClient.hgetall(token);
        }),
      );
      return room;
    },
  },
};
