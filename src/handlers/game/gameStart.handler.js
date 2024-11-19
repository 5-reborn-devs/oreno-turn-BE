import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { rooms } from '../../session/session.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import User from '../../classes/models/user.class.js';

export const gameStart = (socket) => {
  const protoMesages = getProtoMessages();

  let gameStartResponse;

  // gameState
  let currentPhase = protoMesages.enum.PhaseType.DAY; // 낮
  let nextPhaseAt = Date.now() + 180000; // 3분후에 넥스트 페이즈 타입으로 이동
  const gameState = {
    phaseType: currentPhase,
    nextPhaseAt: nextPhaseAt,
  };

  const roomId = socket.roomId;
  const room = rooms.get(roomId);

  // users
  const users = room.users.map((user) => {
    const character = new Character(
      user.character.characterType,
      user.character.roleType,
      user.character.hp,
    );
    character.weapon = user.character.weapon;
    character.stateInfo = user.character.stateInfo;
    character.equips = user.character.equips || [];
    character.debuffs = user.character.debuffs || [];
    character.handCards = user.character.handCards || [];
    character.bbangCount = user.character.bbangCount || 0;
    character.handCardsCount = user.character.handCardsCount || 0;

    return {
      id: user.userId,
      nickname: user.nickname,
      character,
    };
  });
  // characterPositions
  const characterPositions = [];
  const positionKeys = Object.keys(RANDOM_POSITIONS);
  room.users.forEach((user, index) => {
    const positionKey = positionKeys[index % positionKeys.length];
    characterPositions.push({
      id: user.userId,
      x: RANODM_POSITIONS[positionKey].x,
      y: RANDOM_POSITIONS[positionKey].y,
    });
  });

  const gameStartNotification = {
    gameState,
    users,
    characterPositions,
  };
  try {
    gameStartResponse = {
      success: true,
      failcode: failCode.NONE_FAILCODE,
    };
    multiCast(usersInRoom, PACKET_TYPE.GAME_START_NOTIFICATION, {
      gameStartNotification,
    });
  } catch (err) {
    gameStartResponse = {
      success: false,
      failcode: failCode.UNKNOWN_ERROR,
    };
  }
  sendResponsePacket(
    socket,
    PACKET_TYPE.GAME_START_RESPONSE,
    gameStartResponse,
  );
};

// PACKET ID = 34번에서 사용될 가능성이 있어 보임 S2CPhaseUpdateNotification

// setTimeout(() => {
//     //setTimeout 때문에 180000밀리초 이후에 실행
//     currentPhase = protoMessages.enum.PhaseType.END; // 밤으로 페이즈 변경
//     nextPhaseAt = Date.now() + 30000; // 페이즈 변경 시간 30초로 변경
//     const updatedGameState = {
//       PhaseType: currentPhase,
//       nextPhaseAt: nextPhaseAt,
//     };
//     const updatedGameStartNotification = {
//       gameState: updatedGameState,
//       users,
//       characterPositions,
//     };
//     multiCast(usersInRoom, PACKET_TYPE.GAME_START_NOTIFICATION, {
//       updatedGameStartNotification,
//     }); // 밤이라고 노티 다시 보내기
//     sentTimeout(() => {
//       // setTimout 호출 30000밀리초 이후에 실행
//       currentPhase = protoMesages.enum.PhaseType.DAY; // 낮으로 페이지 변경
//       nextPhaseAt = Date.now() + 180000; // 페이즈 변경 시간 30초로 변경
//       const finalGameState = {
//         PhaseType: currentPhase,
//         nextPhaseAt: nextPhaseAt,
//       };
//       const finalGameStartNotification = {
//         gameState: finalGameState,
//         users,
//         characterPositions,
//       };
//       multiCast(usersInRoom, PACKET_TYPE.GAME_START_NOTIFICATION, {
//         finalGameStartNotification,
//       }); // 다시 노티 보냄
//     }, 30000);
//   }, 180000);
