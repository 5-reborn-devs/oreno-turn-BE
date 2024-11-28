import { rooms, users } from '../session/session.js';
import { PACKET_TYPE } from '../constants/header.js';
import sendResponsePacket, {
  multiCast,
} from '../utils/response/createResponse.js';
import { getFailCode } from '../utils/response/failCode.js';
import { releaseRoomId } from '../session/room.session.js';

export const onEnd = (socket) => async () => {
  const room = rooms.get(socket.roomId);
  const user = users.get(socket.token);
  const failCode = getFailCode();
  const leaveRoomResponse = {
    success: true,
    failCode: failCode.NONE_FAILCODE,
  };
  try {
    // 유저가 로비에 있는 경우
    if (!socket.roomId) {
      // 유저 세션에서 제거
      users.delete(socket.token);
      throw new Error(
        `유저 ${user.nickname}이 로비에서 연결이 종료되었습니다.`,
      );
    } 
    else if (socket.roomId !== null) { // 유저가 방에 있을 경우
      const leaveRoomNotification = {
        userId: user.id,
      };
      room.removeUserById(user.id); //방에서 제거
      console.log(`유저 ${user.id}가 방에서 연결이 종료되었습니다.
        ${room.state}`);

      multiCast(room.users, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
        leaveRoomNotification, // 방안에있는 다른유저들에게도 알려줌
      });

      if (!room.users.length) {
        rooms.delete(socket.roomId);
        releaseRoomId(socket.roomId);
      } else {
        if (room.ownerId === user.id) {
          multiCast(room.users, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
            leaveRoomResponse,
          });
          rooms.delete(socket.roomId);
          releaseRoomId(socket.roomId);
          console.log(
            `${socket.roomId}번 방이 방장 ${user.nickname}에 의해 종료되었습니다.`,
          );
        }
      }
      users.delete(socket.token);
    }

    // 게임 안에 있는 경우 (탈주)
    // 유저의 캐릭터에 접근해서 hp를 0으로 만들고 내보내는 구조로
    console.log('캐릭터 불러와지나?: ', user.character.hp);
    //gameStartRequest


  } catch (err) {
    console.error('클라이언트 연결 종료 처리 중 오류 발생', err);
  }
  sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomResponse,
  });
};
