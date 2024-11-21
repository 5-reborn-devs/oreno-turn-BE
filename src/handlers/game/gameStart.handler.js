import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { rooms } from '../../session/session.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';
import User from '../../classes/models/user.class.js';
import { RANDOM_POSITIONS } from '../../constants/randomPositions.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const gameStart = (socket) => {
  const protoMessages = getProtoMessages();
  let gameStartResponse;
  const failCode = getFailCode();
  try {
    // gameState
    let currentPhase = protoMessages.enum.PhaseType.values['DAY']; // 낮
    let nextPhaseAt = Date.now() + 180000; // 3분후에 넥스트 페이즈 타입으로 이동
    const gameState = {
      phaseType: currentPhase,
      nextPhaseAt,
    };

    console.log('커렌트페이즈', currentPhase);

    const roomId = socket.roomId;
    const room = rooms.get(roomId);
    room.state = protoMessages.enum.RoomStateType.values['INGAME'];
    const usersInRoom = [...room.users]; // 방 안에 있는 모든 유저들의 정보를 가져옴
    // users

    // characterPositions
    const characterPositions = [];
    const positionKeys = Object.keys(RANDOM_POSITIONS);
    const usedPositions = new Set();
    room.users.forEach((user) => {
      let positionKey;
      do {
        const randomIndex = Math.floor(Math.random() * positionKeys.length);
        positionKey = positionKeys[randomIndex];
      } while (usedPositions.has(positionKey));
      usedPositions.add(positionKey);
      characterPositions.push({
        id: user.userId,
        x: RANDOM_POSITIONS[positionKey].x,
        y: RANDOM_POSITIONS[positionKey].y,
      });
    });

    const gameStartNotification = {
      gameState,
      users: usersInRoom,
      characterPositions,
    };

    gameStartResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };
    multiCast(usersInRoom, PACKET_TYPE.GAME_START_NOTIFICATION, {
      gameStartNotification,
    });
  } catch (err) {
    gameStartResponse = {
      success: false,
      failCode: failCode.UNKNOWN_ERROR,
    };
    console.log(err);
  }
  sendResponsePacket(socket, PACKET_TYPE.GAME_START_RESPONSE, {
    gameStartResponse,
  });
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
