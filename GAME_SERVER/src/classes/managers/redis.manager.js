import { redisClient } from '../../init/redisConnect.js';

export const redisManager = {
  users: {
    add: async (token, user) => {
      const pipeline = redisClient.pipeline();
      const userData = {
        id: user.id,
        nickname: user.nickname,
      };
      // Redis에 Hash 형식으로 저장
      pipeline.hmset(token, userData);
      pipeline.sadd('users', userData.id);
      await pipeline.exec();
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

    delete: async (token) => {
      const userId = await redisClient.hget(token, 'id');
      const pipeline = redisClient.pipeline();
      pipeline.del(token);
      pipeline.srem('users', userId);
      await pipeline.exec();
    },

    setRoomId: async (token, roomId) => {
      await redisClient
        .multi()
        .hset(token, 'roomId', roomId)
        .hget(token, 'roomId')
        .exec();
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
          room.users = await redisClient.hkeys(`${roomId}:users`);
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
          const users = await redisClient.hkeys(`${roomId}:users`);
          return users.length < maxUserNum;
        }),
      );
    },

    delete: async (roomId) => {
      const pipeline = redisClient.pipeline();
      const tokens = await redisClient.hvals(`${roomId}:users`);
      tokens.forEach((token) => pipeline.hdel(token, 'roomId'));
      pipeline.del(roomId);
      pipeline.del(`${roomId}:users`);
      pipeline.srem('rooms', roomId);
      await pipeline.exec();
    },

    addUser: async (roomId, user, token) => {
      await redisClient.hset(`${roomId}:users`, user.id, token);
    },

    removeUser: async (roomId, user) => {
      await redisClient.hdel(`${roomId}:users`, user.id);
    },

    getUsers: async (roomId) => {
      return await redisClient.hkeys(`${roomId}:users`);
    },

    getUser: async (roomId, user) => {
      return await redisClient.hget(`${roomId}:users`, user.id);
    },

    getUsersData: async (roomId) => {
      const userTokens = await redisClient.hvals(`${roomId}:users`);
      return await Promise.all(
        userTokens.map(async (token) => await redisClient.hgetall(token)),
      );
    },

    getRoomData: async (roomId) => {
      const room = await redisClient.hgetall(roomId);
      const userTokens = await redisClient.hvals(`${roomId}:users`);
      room.users = await Promise.all(
        userTokens.map(async (token) => await redisClient.hgetall(token)),
      );

      return room;
    },
  },
};
