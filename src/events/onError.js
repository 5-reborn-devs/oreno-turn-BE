import { removeUser } from "../session/user.session.js";

export const onError = (socket) => (err) => {
  console.error('소켓 오류:', err);

  // 오류가 난 유저의 세션을 제거한다.
  removeUser(socket);
};
