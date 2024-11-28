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
  let message = `유저 ${user.id}가 방에서 연결이 종료되었습니다.`;
  try {
    if (!socket.roomId) { // 유저가 로비에 있는 경우
      users.delete(socket.token);
      throw new Error(
        `유저 ${user.nickname}이 로비에서 연결이 종료되었습니다.`,
      );
    }
    // 유저가 방에 있을 경우
    else if (socket.roomId !== null) {
      const leaveRoomNotification = {
        userId: user.id,
      };
      // 방에 아무도 없을 경우
      if (!room.users.length) { 
        rooms.delete(socket.roomId);
        releaseRoomId(socket.roomId);
      } else {
         // 게임 안에 있는 경우 (탈주)
        if (room.state == 2) {
          //gameStartRequest
          user.character.hp = 0;
          console.log('유저 체력 : ', user.character.hp);
          message = `유저 ${user.id}가 게임을 나갔습니다.`;
        }
        // 방에 유저가 남아있는데 방장이 종료할 경우
        else if (room.ownerId === user.id) { 
          rooms.delete(socket.roomId);
          releaseRoomId(socket.roomId);
          message = `${socket.roomId}번 방이 방장 ${user.nickname}에 의해 종료되었습니다.`;
          multiCast(room.users, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
            leaveRoomResponse,
          });
        }
      }
      room.removeUserById(user.id); //방에서 유저 제거
      users.delete(socket.token);
      
      console.log(message);

      multiCast(room.users, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
        leaveRoomNotification, // 방안에있는 다른유저들에게도 알려줌
      });
    }

  } catch (err) {
    console.error('클라이언트 연결 종료 처리 중 오류 발생', err);
  }
  sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomResponse,
  });
  sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomResponse,
  });
};
