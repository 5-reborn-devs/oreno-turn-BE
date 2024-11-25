import { rooms } from './session.js';

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
