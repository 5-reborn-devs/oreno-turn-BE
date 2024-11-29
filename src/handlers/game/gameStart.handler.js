import { PACKET_TYPE } from '../../constants/header.js';
import { RANDOM_POSITIONS } from '../../constants/randomPositions.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { rooms, clients } from '../../session/session.js';
import { parseMyData } from '../../utils/notification/myUserData.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { phaseUpdateNotificationHandler } from '../sync/phase.update.handler.js';

export const gameStart = (socket) => {
  const protoMessages = getProtoMessages();
  let gameStartResponse;
  const failCode = getFailCode();
  try {
    // gameState
    //  let currentPhase = protoMessages.enum.PhaseType.values['DAY'];

    // 낮에만 캐릭터가 이동 가능
    
    let nextPhaseAt = Date.now() + 18000; // 3분후에 넥스트 페이즈 타입으로 이동 // 테스트용 10초
    const roomId = socket.roomId;
    const room = rooms.get(roomId);


    const gameState = {
      phaseType: room.phaseType,
      nextPhaseAt,
    };

    console.log('게임 스타트 페이즈 체크: ', room.phaseType);
    room.state = protoMessages.enum.RoomStateType.values['INGAME'];
    const usersInRoom = [...room.users]; // 방 안에 있는 모든 유저들의 정보를 가져옴

    console.log('방내 유저정보', usersInRoom);
    // users
    // characterPositions
    const characterPositions = [];
    //const positionKeys = Object.keys(RANDOM_POSITIONS);
    const positionKeys = [21, 22, 23];
    const usedPositions = new Set();

    room.users.forEach((user) => {
      let positionKey;
      do {
        //const randomIndex = Math.floor(Math.random() * positionKeys.length);
        //positionKey = positionKeys[randomIndex];
        positionKey =
          positionKeys[Math.floor(Math.random() * positionKeys.length)];
      } while (usedPositions.has(positionKey));
      usedPositions.add(positionKey);
      // console.log('x,y값', RANDOM_POSITIONS[positionKey]);
      characterPositions.push({
        id: user.id,
        x: RANDOM_POSITIONS[positionKey].x,
        y: RANDOM_POSITIONS[positionKey].y,
      });
    });

    const startUserData = []
    usersInRoom.forEach((user) => {
      startUserData.push(parseMyData(user))
    })

    const gameStartNotification = {
      gameState,
      users: startUserData,
      characterPositions,
    };

    gameStartResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };

    room.button(socket);

    console.log([...clients.keys()]);
    multiCast(usersInRoom, PACKET_TYPE.GAME_START_NOTIFICATION, {
      gameStartNotification
    });
    //이 부근 언저리 즘에서 인터벌 매니저 생성?

    // room.getIntervalManager().addPlayer(
    //   roomId,
    //   () => {
    //     phaseUpdateNotificationHandler(socket);
    //   },
    //   18000, // 밤으로 변한뒤

    // );

    // 인터벌  룸 클래스 > 페이즈 업데이트 핸들러 기동
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