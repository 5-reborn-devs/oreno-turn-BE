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

export let nextRoomId = 1;
// 방 번호 생성
export const getNextRoomId = () => {
  if (roomIdSet.size > 0) {
    // 반환 받은 방번호가 있다면
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
// 여기서 방 생성
// 1 //초기에는 roomIdSet.Size 가 0이니까 바로 1을 반환하게됨 return nextRoomId
// 2 // 여기서부터는 사이즈가 1이니까 조건 충족해서 2를 반환하게 됨
// 3

// 반환
// roomidSet = {1}
//

// 메시지 큐 방식 테스트 중
const roomQueues = new Map(); // 방별 메시지 큐 관리

// 방의 메시지 큐 초기화
export const initializeRoomQueue = (roomId) => {
  if (!roomQueues.has(roomId)) {
    roomQueues.set(roomId, new Map()); // 사용자 ID별 위치 큐
  }
};

// 방의 메시지 큐 가져오기
export const getRoomQueue = (roomId) => {
  return roomQueues.get(roomId);
};

// 방의 메시지 큐에 위치 업데이트 추가
export const addToRoomQueue = (roomId, userId, position) => {
  const queue = getRoomQueue(roomId);
  if (queue) {
    queue.set(userId, position); // 사용자 ID 기준으로 최신 위치 저장
  }
};

// 방의 메시지 큐 비우기 (처리 후)
export const clearRoomQueue = (roomId) => {
  const queue = getRoomQueue(roomId);
  if (queue) {
    queue.clear();
  }
};
