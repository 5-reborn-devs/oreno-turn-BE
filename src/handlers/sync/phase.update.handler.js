import { PACKET_TYPE } from '../../constants/header.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import  { multiCast} from '../../utils/response/createResponse.js';
import { RANDOM_POSITIONS } from '../../constants/randomPositions.js';
import { eveningDrawHandler } from './evening.phase.handler.js';
import { userUpdateMultiCast } from '../../utils/notification/notification.userUpdate.js';


//페이즈가 넘어갈때, 호출 넘어갔는지 체크.
export const phaseUpdateNotificationHandler = async (room, nextState) => {
  //페일 코드
  const failCode = getFailCode();
  const phaseUpdateNotification = {
    success: false,
    failCode: failCode.UNKNOWN_ERROR,
  };


  try {

    //패 초기화
    room.users.forEach((user) => {
      user.character.cards.reroll();
      console.log("리롤 후 플레이어의 손패:",user.character.cards.getHands());  
      console.log("리롤 후  개인 덱 :",user.character.cards.deck);
    });
    userUpdateMultiCast(room.users);

    // characterPositions : 캐릭터 위치 랜덤
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

    //phaseType : 황혼 코드 수정
    if (room.phaseType === 1) {
      console.log(`황혼으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);
      room.phaseType = 2;

      //여기서부터
      eveningDrawHandler(room);
    } else if (room.phaseType === 2) {
      console.log(`밤으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);
      room.phaseType = 3;


    } else if (room.phaseType === 3) {
      console.log(`낮으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);
      room.phaseType = 1;
    } else {
      //기타 처리
    }

    //nextPhaseAt : 페이즈별 시간처리
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
