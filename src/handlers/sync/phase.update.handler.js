import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { RANDOM_POSITIONS } from '../../constants/randomPositions.js';
import Card from '../../classes/models/card.class.js';
import { fyShuffle } from '../../utils/fisherYatesShuffle.js';
import { getUserById, getUserBySocket } from '../../session/user.session.js';
import { eveningDraw, eveningPick } from './evening.phase.handler.js';
import { marketOpen } from './market.handler.js';

//페이즈가 넘어갈때, 호출 넘어갔는지 체크.
export const phaseUpdateNotificationHandler = async (room, nextState) => {
  //페일 코드
  const failCode = getFailCode();
  const phaseUpdateNotification = {
    success: false,
    failCode: failCode.UNKNOWN_ERROR,
  };
  try {
    //const room = rooms.get(socket.roomId);

    // characterPositions
    const characterPositions = [];
    //const positionKeys = Object.keys(RANDOM_POSITIONS);
    const positionKeys = [21, 22];
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

    //phaseShift : 황혼 코드 수정
    if (room.phaseType === 1) {
      console.log(`황혼으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);

      //공통 드로우 & 상점 오픈
      eveningDraw(room);
      marketOpen(room);

      room.phaseType = 2;
    } else if (room.phaseType === 2) {
      console.log(`밤으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);

      room.isMarketOpen = false;
      room.phaseType = 3;
    } else if (room.phaseType === 3) {
      console.log(`낮으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);
      room.isMarketOpen = false;
      room.phaseType = 1;
    } else {
      //기타 처리
    }

    //페이즈별 시간처리
    let nextPhaseAt = Date.now() + nextState;

    // 노티 만들기
    const phaseUpdateNotification = {
      phaseType: room.phaseType,
      nextPhaseAt,
      characterPositions,
    };

    // 방 전체 슛
    const usersInRoom = getUsersInRoom(room.id);
    multiCast(usersInRoom, PACKET_TYPE.PHASE_UPDATE_NOTIFICATION, {
      phaseUpdateNotification,
    });
  } catch (error) {
    console.error('페이즈 전환중 에러', error);
  }
};
/*
message S2CPhaseUpdateNotification {
    PhaseType phaseType = 1; // DAY 1, END 3 (EVENING은 필요시 추가)
    int64 nextPhaseAt = 2; // 다음 페이즈 시작 시점(밀리초 타임스탬프)
    repeated CharacterPositionData characterPositions = 3; // 변경된 캐릭터 위치
}
*/

//Remain Problem : 드로우에서나 상점에서 고르지 않은 카드들은 다시 덱으로 반환해서 섞는다. : 확인
//카드 매수 확인 : 확인 완료
//함수 분리 : 확인

//덱의 카드들을 전부 다썼을때, 공통 덱을 다시 생성해주는가?
