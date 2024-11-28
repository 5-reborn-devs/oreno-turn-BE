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
  rooms.get(userRoomId);
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

export let nextRoomId = 1;
// 방 번호 생성
export const getNextRoomId = () => {
  if (roomIdSet.size > 0) { // 반환 받은 방번호가 있다면
    const roomId = roomIdSet.values().next().value; // 
    roomIdSet.delete(roomId);
    return roomId;
  }
  return nextRoomId++;
};

// 방 번호 반납
export const releaseRoomId = (roomId) => {
  roomIdSet.add(roomId);
};
