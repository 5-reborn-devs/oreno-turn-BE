import { removeUser } from '../session/user.session.js';

export const onError = (socket) => (err) => {
  console.error('소켓 오류:', err);
  console.error(`token:${socket.token} roomId:${socket.roomId}`);

  // 오류가 난 유저의 세션을 제거한다.
  // removeUser(socket);

  // 게임 세션을 따로 관리해서 거기에 해당하는 유저를 지워주는 것 같다.
};
