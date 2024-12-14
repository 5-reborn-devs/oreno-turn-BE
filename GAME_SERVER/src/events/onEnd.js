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

export const onEnd = (socket) => async () => {
  if (socket.isEndIgnore) {
    console.log('onEnd 무시됨.');
    return;
  }

  const roomId = socket.roomId;
  const room = rooms.get(roomId);
  const token = socket.token;
  let user = await redisManager.users.get(token);
  const userIds = await redisManager.rooms.getUsers(roomId);
  const failCode = getFailCode();
  const leaveRoomResponse = {
    success: true,
    failCode: failCode.NONE_FAILCODE,
  };
  let message = `유저 ${user.nickname}가 방에서 연결이 종료되었습니다.`;
  const leaveRoomNotification = {
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
    }

    // 게임 안에 있는 경우 (탈주)
    else if (room.state == 2) {
      user = users.get(token);
      user.character.hp = 0;
      multiCast(room.users, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
        userUpdateNotification: { user: room.users },
      });

      message = `유저 ${user.nickname}가 게임을 나갔습니다.`;

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
        room.removeUserById(user.id); //방에서 유저 제거
        const usersInRoom = [...room.users];

        // 레디스에 유저의 방 정보 삭제
        await redisManager.users.delRoomId(usersInRoom);
        // 방 정보 제거
        rooms.delete(room.id);
        await redisManager.rooms.delete(room.id);

        const gameServerSwitchNotification = {
          ip: '127.0.0.1',
          port: 9000,
        };

        multiCast(usersInRoom, PACKET_TYPE.GAME_SERVER_SWITCH_NOTIFICATION, {
          gameServerSwitchNotification, // 승리자 클라에게 전송해줌 로비 서버로 변경하라고 요청 -> 클라에서 변경 ->
        });
      }
    }

    // 방에 유저가 남아있는데 방장이 종료할 경우
    else if (room.ownerId === user.id) {
      redisManager.rooms.delete(roomId);
      releaseRoomId(roomId);
      message = `${roomId}번 방이 방장 ${user.nickname}에 의해 종료되었습니다.`;
      multiCast(userIds, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
        leaveRoomResponse,
      });

      multiCast(userIds, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
        leaveRoomNotification, // 방안에있는 다른유저들에게도 알려줌
      });
    }

    users.delete(token);
    redisManager.users.delete(token);
    console.log(message);
  } catch (err) {
    console.error('클라이언트 연결 종료 처리 중 오류 발생', err);
  }
  sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomResponse,
  });
};
