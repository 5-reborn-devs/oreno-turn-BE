import { PACKET_TYPE } from '../../constants/header.js';
import { rooms } from '../../session/session.js';
import User from '../../classes/models/user.class.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { multiCast } from '../../utils/response/createResponse.js';
//페이즈가 넘어갈때, 호출 넘어갔는지 체크.
/* 
영향을 받는것들 

플리마켓은 밤에만 열림.
전투는 낮에만 가능. 
페이즈가 넘어가는 시점에 공용 테이블 카드 분배등.

message S2CPhaseUpdateNotification {
    PhaseType phaseType = 1; // DAY 1, END 3 (EVENING은 필요시 추가)
    int64 nextPhaseAt = 2; // 다음 페이즈 시작 시점(밀리초 타임스탬프)
    repeated CharacterPositionData characterPositions = 3; // 변경된 캐릭터 위치
}
*/
export const phaseUpdateNotificationHandler = async (socket) => {
  //페일 코드
  const failCode = getFailCode();
  const phaseUpdateNotification = {
    success: false,
    failCode: failCode.UNKNOWN_ERROR,
  };

  try {
    const users = {};

    // characterPositions
    const characterPositions = [];
    let positionKeys = Object.keys(RANDOM_POSITIONS);

    const roomId = socket.roomId;
    const room = rooms.get(roomId);
    room.users.forEach((user, index) => {
      const userData = new User(user.userId, user.nickname, user.character);
      users[user.userId] = {
        id: userData.id,
        nickname: userData.nickname,
        character: userData.character,
      };
      const positionKey = positionKeys[index % positionKeys.length];
      characterPositions.push({
        id: user.userId,
        x: RANDOM_POSITIONS[positionKey].x,
        y: RANDOM_POSITIONS[positionKey].y,
      });
    });

    //phaseShift
    if (room.phaseType === 1) {
      console.log(`밤으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);
      room.phaseType = 3;
    } else if (room.phaseType === 3) {
      console.log(`낮으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);
      room.phaseType = 1;
    } else {
      //기타 처리
    }

    // 노티 만들기
    const notification = {
      phaseType: room.phaseType,
      nextPhaseAt: Date.now() + 180000,
      characterPositions: characterPositions,
      success: true,
    };

    // 방 전체 슛
    const usersInRoom = getUsersInRoom(socket.roomId);
    multiCast(usersInRoom, PACKET_TYPE.PHASE_UPDATE_NOTIFICATION, notification);
  } catch (error) {
    console.error('페이즈 전환중 에러');
  }
};
