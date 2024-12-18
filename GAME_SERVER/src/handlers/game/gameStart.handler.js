import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { RANDOM_POSITIONS } from '../../constants/randomPositions.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { rooms } from '../../session/session.js';
import { gameStartMultiCast } from '../../utils/notification/notification.gameStart.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const gameStart = (socket) => {
  const protoMessages = getProtoMessages();
  let gameStartResponse;
  const failCode = getFailCode();
  try {
    // 낮에만 캐릭터가 이동 가능

    const roomId = socket.roomId;
    const room = rooms.get(roomId);
    const currentTime = Date.now();
    const nextPhaseAt = currentTime + config.page.afternoon; // 3분후에 넥스트 페이즈 타입으로 이동 // 테스트용 10초

    const gameState = {
      phaseType: room.phaseType,
      nextPhaseAt: nextPhaseAt,
    };

    room.state = protoMessages.enum.RoomStateType.values['INGAME'];
    const usersInRoom = [...room.users]; // 방 안에 있는 모든 유저들의 정보를 가져옴

    const characterPositions = [];
    const positionKeys = Object.keys(RANDOM_POSITIONS);
    //const positionKeys = [21, 22, 23];
    const usedPositions = new Set();

    room.users.forEach((user) => {
      let positionKey;
      do {
        positionKey =
          positionKeys[Math.floor(Math.random() * positionKeys.length)];
      } while (usedPositions.has(positionKey));
      usedPositions.add(positionKey);
      characterPositions.push({
        id: user.id,
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

    // 게임 유저 정보 동기화
    gameStartMultiCast(gameStartNotification);

    // 페이즈 업데이트 인터벌 기동
    room.button(nextPhaseAt);
  } catch (err) {
    gameStartResponse = {
      success: false,
      failCode: failCode.UNKNOWN_ERROR,
    };
    console.log(err);
  }
  // sendResponsePacket(socket, PACKET_TYPE.GAME_START_RESPONSE, {
  //   gameStartResponse,
  // });
};
