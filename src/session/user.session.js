import { users } from "./session.js";

// 유저 세션에 토큰 키와 함께 유저 정보 값 전달
export const addUser = (token, myInfo) => {
    users.set(token, myInfo);
}

// 해당 email을 가진 유저 중복 로그인 여부 확인
export const userLoggedIn = (email) => {
    return [...users.values()].some((userInfo) => userInfo.id === email);
}

// 유저 세션에서 socket으로 유저 찾는 함수
export const getUserBySocket = (socket) => {
  const user = users.find((user) => user.socket === socket);
  return user;
};

// 나 외의 유저들을 socket으로 찾는 함수
export const getOtherUsersBySocket = (socket) => {
  const otherUsers = users.filter((user) => user.socket !== socket);
  return otherUsers;
};
