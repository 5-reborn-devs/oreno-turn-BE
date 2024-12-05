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
  const leaveRoomNotification = {
    userId: user.id,
  };

  try {
    // 유저가 로비에 있는 경우
    if (!socket.roomId) {
      users.delete(socket.token);
      message = `유저 ${user.nickname}이 로비에서 연결이 종료되었습니다.`;
      console.log(message);
    }

    // 방에 아무도 없을 경우
    if (!room.users.length) {
      rooms.delete(socket.roomId);
      releaseRoomId(socket.roomId);
    }

    else if (room.state == 2) {
      // 게임 안에 있는 경우 (탈주)
      user.character.hp = 0;

      multiCast(room.users, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
        userUpdateNotification: { user: room.users },
      });

      message = `유저 ${user.id}가 게임을 나갔습니다.`;

      const survivers = room.users.filter((user) => user.character.hp > 0);

      // 만약 남은 유저의 탈주로 인해 생존자가 한 명일 경우
      if (survivers.length === 1) {
        const winner = survivers[0];

        const gameEndNotification = {
          winners: [winner.id],
          winType: 2, // 배틀로얄이라 사이코 밖에 없음.
        };

        multiCast(room.users, PACKET_TYPE.GAME_END_NOTIFICATION, {
          gameEndNotification,
        });

        room.stopCustomInterval();
      }
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

    room.removeUserById(user.id); //방에서 유저 제거
    users.delete(socket.token);
    console.log(message);

    multiCast(room.users, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
      leaveRoomNotification, // 방안에있는 다른유저들에게도 알려줌
    });

  } catch (err) {
    console.error('클라이언트 연결 종료 처리 중 오류 발생', err);
  }
  sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomResponse,
  });
};
