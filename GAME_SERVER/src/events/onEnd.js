import { clients, rooms, users } from '../session/session.js';
import { PACKET_TYPE } from '../constants/header.js';
import sendResponsePacket, {
  multiCast,
} from '../utils/response/createResponse.js';
import { getFailCode } from '../utils/response/failCode.js';
import { getUsersWithoutMe, releaseRoomId } from '../session/room.session.js';
import { redisManager } from '../classes/managers/redis.manager.js';
import { redisClient } from '../init/redisConnect.js';
import { serverSwitch } from '../utils/notification/notification.serverSwitch.js';
import { config } from '../config/config.js';
import { setUsersServerMove } from '../session/user.session.js';
import { winMultiCast } from '../utils/notification/notification.win.js';
import { leaveRoomHandler } from '../handlers/room/room.leave.handler.js';

export const onEnd = (socket) => async () => {
  const token = socket.token;
  let user = users.get(token);
  if (user && user.isEndIgnore) {
    // 내부 데이터 삭제
    users.delete(socket.token);
    clients.delete(Number(user.id));

    // 레디스 데이터 삭제
    await redisManager.users.delRoomId(token);
    console.log(`[서버 이동] (${user.nickname}) Game -> Lobby`); // onEnd 무시됨.
    return;
  }

  const roomId = socket.roomId;
  const room = rooms.get(roomId);
  user = await redisManager.users.get(token);
  const userIds = await redisManager.rooms.getUsers(roomId);
  const failCode = getFailCode();
  const leaveRoomResponse = {
    success: true,
    failCode: failCode.NONE_FAILCODE,
  };
  let message = `유저 ${user.nickname}가 방에서 연결이 종료되었습니다.`;
  let leaveRoomNotification = {
    userId: user.id,
  };

  try {
    // 유저가 로비에 있는 경우
    if (!roomId) {
      message = `유저 ${user.nickname}이 로비에서 연결이 종료되었습니다.`;
    }
    // 방에 자신 이외에 아무도 없을 경우
    else if (userIds.length <= 1) {
      redisManager.rooms.delete(roomId);
      releaseRoomId(roomId);
    } else if (!room) {
    }
    // 게임 안에 있는 경우 (탈주)
    else if (room.state == 2) {
      user = users.get(token);
      user.character.hp = 0;
      multiCast(room.users, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
        userUpdateNotification: { user: room.users },
      });

      message = `유저 ${user.nickname}가 게임을 나갔습니다.`;

      // 승리 확인
      winMultiCast(room);
    }

    // 방에 유저가 남아있는데 방장이 종료할 경우
    else if (room.ownerId === user.id) {
      redisManager.rooms.delete(roomId);
      releaseRoomId(roomId);
      message = `${roomId}번 방이 방장 ${user.nickname}에 의해 종료되었습니다.`;
      multiCast(userIds, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
        leaveRoomResponse,
      });
    }

    multiCast(userIds, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
      leaveRoomNotification, // 방안에있는 다른유저들에게도 알려줌
    });

    users.delete(token);
    redisManager.users.delete(token, roomId);
    console.log(message);
  } catch (err) {
    console.error('클라이언트 연결 종료 처리 중 오류 발생', err);
    console.error(`token:${socket.token} roomId:${socket.roomId}`);
    console.error(`room data:\n${room}`);
  }
  sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomResponse,
  });
};
