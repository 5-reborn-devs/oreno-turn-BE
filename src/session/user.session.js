import { users, clients } from './session.js';

// 유저 세션에 토큰 키와 함께 유저 정보 값 전달
export const addUser = (token, myInfo) => {
  users.set(token, myInfo);
};

// 해당 email을 가진 유저 중복 로그인 여부 확인
export const userLoggedIn = (userId) => {
  return [...users.values()].some((userInfo) => userInfo.id === userId);
};

// 유저 세션에서 socket으로 유저 찾는 함수
export const getUserBySocket = (socket) => {
  const user = users.get(socket.token)
  return user;
};

// 나 외의 유저들을 socket으로 찾는 함수
export const getOtherUsersBySocket = (socket) => {
  const otherUsers = [...users.values()].filter((user) => user.socket !== socket);
  return otherUsers;
};

export const getUserById = (userId) => {
  try{
    const socket = clients.get(userId);
    if(!socket) throw new Error(`${userId}가 클라이언트 세션에 존재하지 않습니다.`)
    
    const user = users.get(socket.token);
    return user;
    
  } catch(error) {
    console.error()
    return false;
  }
};

export const getOtherUsersById = (userId) => {
  const otherUsers = [...users.values()].filter((user) => user.id !== userId);
  return otherUsers;
};
