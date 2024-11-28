import { PACKET_TYPE } from '../../constants/header.js';
import { rooms } from '../../session/session.js';
//import User from '../../classes/models/user.class.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { RANDOM_POSITIONS } from '../../constants/randomPositions.js';
//페이즈가 넘어갈때, 호출 넘어갔는지 체크.
export const phaseUpdateNotificationHandler = async (room, nextState) => {
  //페일 코드
  const failCode = getFailCode();
  const phaseUpdateNotification = {
    success: false,
    failCode: failCode.UNKNOWN_ERROR,
  };
  try {

    // const room = rooms.get(socket.roomId);
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
      room.phaseType = 2;
    } else if (room.phaseType === 2) {
      console.log(`밤으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);
      room.phaseType = 3;
    } else if (room.phaseType === 3) {
      console.log(`낮으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);
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

    //room.getIntervalManager().removePlayer(roomId); 리무브 체크
    //여기서 황혼 카드 수급 핸들링 하거나,
    //publicPoolDrawHandler()?
    //클라에 한번 페이즈 전환을 보내서 동기화 시키고, 황혼 카드 수급 핸들러를 클라에서 호출하는 방식.
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
