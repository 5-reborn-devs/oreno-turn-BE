import CharacterState from '../../classes/models/character.state.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { clients, rooms, users } from '../../session/session.js';
import { getUserById } from '../../session/user.session.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { leaveRoomHandler } from '../room/room.leave.handler.js';

export const reactionHandler = async (socket) => {
  const failCode = getFailCode();
  let reactionResponse;

  try {
    // 공격당한 유저의 정보
    const user = users.get(socket.token);
    const character = user.character;
    let stateInfo = character.stateInfo;

    // 뱅을 쏜 유저의 상태를 초기화
    const shooterId = stateInfo.stateTargetUserId;
    const shooter = getUserById(shooterId);
    shooter.character.stateInfo = new CharacterState();

    // 공격당한 유저의 상태를 초기화
    character.stateInfo = new CharacterState(); // 만약 state = new CharacterState로 초기화하면 반영안됨.
    character.hp -= 1;

    reactionResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };

    // 총에 맞았음으로 유저 상태를 동기화
    const room = rooms.get(socket.roomId);
    multiCast(room.users, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
      userUpdateNotification: { user: room.users },
    });

    // 방에 피가 1이상 남은 생존자 찾기
    const survivers = room.users.filter((user) => user.character.hp > 0);

    // 생존자가 1명이면 그 사람이 승리
    if (survivers.length === 1) {
      const winner = survivers[0];

      const gameEndNotification = {
        winners: [winner.id],
        winType: 2, // 배틀로얄이라 사이코 밖에 없음.
      };

      multiCast(room.users, PACKET_TYPE.GAME_END_NOTIFICATION, {
        gameEndNotification,
      });
    }
  } catch (error) {
    reactionResponse = {
      success: false,
      failCode: failCode.UNKNOWN_ERROR,
    };

    console.error('리액션 실패: ', error);
  }

  sendResponsePacket(socket, PACKET_TYPE.REACTION_RESPONSE, {
    reactionResponse,
  });
};
