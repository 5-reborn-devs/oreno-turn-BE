import CharacterState from '../../classes/models/character.state.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getUserRoom, getUsersInRoom } from '../../session/room.session.js';
import { users } from '../../session/session.js';
import { getUserById } from '../../session/user.session.js';
import { userUpdateMultiCast } from '../../utils/notification/notification.userUpdate.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

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

    // 리액션 종료 후 유저 상태 동기화
    const roomId = socket.roomId;
    const allUsersInRoom = getUsersInRoom(roomId);
    userUpdateMultiCast(allUsersInRoom);
    
    const room = getUserRoom(roomId)
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
