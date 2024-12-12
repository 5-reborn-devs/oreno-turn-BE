import { PACKET_TYPE } from '../../constants/header.js';
import { rooms } from '../../session/session.js';
import { users } from '../../session/session.js';
import User from '../../classes/models/user.class.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';

//핸들러라고 볼수있나?
export const userUpdateNotificationHandler = async (socket) => {
  //페일 코드
  const failCode = getFailCode();
  const userUpdateNotification = {
    success: false,
    failCode: failCode.UNKNOWN_ERROR,
  };

  try {
    //유저 받아옴.
    const user = users.get(socket.token);

    /*검증구간
     */

    //노티 생성
    const userUpdateNotification = {
      user: [
        {
          id: user.id,
          nickname: user.nickname,
          character: user.character,
        },
      ],
    };

    //방 전체 슛
    const usersInRoom = getUsersInRoom(socket.roomId);
    multiCast(
      usersInRoom,
      PACKET_TYPE.USER_UPDATE_NOTIFICATION,
      userUpdateNotification,
    );
  } catch (error) {
    console.error('유저 상태 업데이트 오류 터졌슴..');
  }
};
// message S2CUserUpdateNotification {
//     repeated UserData user = 1;
// }

