import { users } from "./session.js";


// 유저 세션에서 socket으로 유저 찾는 함수
export const getUserBySocket = (socket) => {
    const user = users.find((user) => user.socket === socket)
    return user;
}

// 나 외의 유저들을 socket으로 찾는 함수
export const getOtherUsersBySocket = (socket) => {
    const otherUsers = users.filter((user) => user.socket !== socket);
    return otherUsers;
}

export const getUserById = (userId) => {
    const user = users.get(userId);
    return user;
}
