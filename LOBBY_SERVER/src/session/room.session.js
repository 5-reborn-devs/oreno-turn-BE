import { redisClient } from '../init/redisConnect.js';
import { rooms, roomIdSet } from './session.js';

export const createRoom = (roomData) => {
  rooms.set(roomData.id, roomData);
};

export const deleteRoom = (roomId) => {
  rooms.delete(roomId);
};

export const clearRooms = () => {
  rooms.clear();
};

export const getUserRoom = (userRoomId) => {
  const room = rooms.get(userRoomId);
  return room;
};

export const getEmptyRooms = () => {
  return [...rooms.values()].filter(
    (room) => room.maxUserNum > room.users.length,
  );
};

export const getUsersInRoom = (roomId) => {
  const room = rooms.get(roomId);
  return [...room.users];
};

export const getUsersWithoutMe = (roomId, userId) => {
  const room = rooms.get(roomId);
  const users = [...room.users];

  return users.filter((user) => user.id != userId);
};

// 방 번호 생성
export const getNextRoomId = async () => {
  await redisClient.incr('roomId');
  const roomId = await redisClient.get('roomId');
  return Number(roomId);
};

// 방 번호 반납
export const releaseRoomId = (roomId) => {
  roomIdSet.add(roomId);
};
// 여기서 방 생성
// 1 //초기에는 roomIdSet.Size 가 0이니까 바로 1을 반환하게됨 return nextRoomId
// 2 // 여기서부터는 사이즈가 1이니까 조건 충족해서 2를 반환하게 됨
// 3

// 반환
// roomidSet = {1}
//
