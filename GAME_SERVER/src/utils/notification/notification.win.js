import { redisManager } from '../../classes/managers/redis.manager.js';
import { rooms } from '../../session/session.js';
import { setUsersServerMove } from '../../session/user.session.js';
import { multiCast } from '../response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { config } from '../../config/config.js';

export const winMultiCast = async (room) => {
  const survivers = room.users.filter((user) => user.character.hp > 0);

  // 만약 남은 유저의 탈주로 인해 생존자가 한 명일 경우
  if (survivers.length === 1) {
    const winner = survivers[0];

    const gameEndNotification = {
      winners: [winner.id],
      winType: 2, // 배틀로얄이라 사이코 밖에 없음.
    };

    const usersInRoom = [...room.users];

    multiCast(usersInRoom, PACKET_TYPE.GAME_END_NOTIFICATION, {
      gameEndNotification,
    });

    room.stopCustomInterval();

    // 방정보 제거
    await redisManager.rooms.delete(room.id); // Redis

    const SWITCH_RESPONSE = {
      ip: config.server.host,
      port: 9000,
    };

    // 다른 유저들을 로비서버로 이동시킴.
    setUsersServerMove(usersInRoom);
    multiCast(usersInRoom, PACKET_TYPE.SWITCH_RESPONSE, {
      SWITCH_RESPONSE, // 승리자 클라에게 전송해줌 로비 서버로 변경하라고 요청 -> 클라에서 변경 ->
    });

    // 방 정보 제거
    rooms.delete(room.id); // 내부

    return true;
  }
  return false;
};
