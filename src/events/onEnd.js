import { rooms, users } from '../session/session.js';
import { PACKET_TYPE } from '../constants/header.js';
import { multiCast, sendResponsePacket } from '../utils/response/createResponse.js';
import { getFailCode } from '../utils/response/failCode.js';
import { releaseRoomId } from '../session/room.session.js';

export const onEnd = (socket) => async () => {
  // 방 정보
  const room = rooms.get(socket.roomId);
  const user = users.get(socket.token);
  const failCode = getFailCode();

  try {
    // 유저가 로비에 있는 경우
    if (!socket.roomId) {
      // 유저 세션에서 제거
      users.delete(socket.token);
      console.log(`유저 ${user.nickname}이 로비에서 연결이 종료되었습니다.`);
    }

    else {
      const leaveRoomNotification = {
        userId: user.id,
      };
      room.removeUserById(user.id); //방에서 제거
      console.log(`유저 ${user.id}가 방에서 연결이 종료되었습니다.`);

      multiCast(room.users, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
        leaveRoomNotification, // 방안에있는 다른유저들에게도 알려줌
      });
      // 방에 사람이 없을 때
      if (!room.users.length) {
        rooms.delete(socket.roomId);
        releaseRoomId(socket.roomId);
      } else {
        if (room.ownerId === user.id) {
          // 유저가 방에 있는지
          const leaveRoomResponse = {
            success: true,
            failCode: failCode.NONE_FAILCODE,
          };
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
    // 게임, 유저 세션에서 제거
  } catch (err) {
    console.error('클라이언트 연결 종료 처리 중 오류 발생', err);
  }

  sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomResponse,
  });
};
