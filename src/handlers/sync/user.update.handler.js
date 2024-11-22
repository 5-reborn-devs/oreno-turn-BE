import { PACKET_TYPE } from '../../constants/header.js';
import { rooms } from '../../session/session.js';
import { users } from '../../session/session.js';
import User from '../../classes/models/user.class.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';

// message S2CUserUpdateNotification {
//     repeated UserData user = 1;
// }

//핸들러라고 볼수있나?

export const userUpdateNotificationHandler = async (socket) => {
  //페일 코드
  const failCode = getFailCode();
  const userUpdateNotification = {
    success: false,
    failCode: failCode.UNKNOWN_ERROR,
  };

  try {
    //유저 받아옴.
    const user = users.get(socket.token);

    /*검증구간
     */

    //노티 생성
    const userUpdateNotification = {
      user: [
        {
          id: user.id,
          nickname: user.nickname,
          character: user.character,
        },
      ],
    };

    //방 전체 슛
    const usersInRoom = getUsersInRoom(socket.roomId);
    multiCast(
      usersInRoom,
      PACKET_TYPE.USER_UPDATE_NOTIFICATION,
      userUpdateNotification,
    );
  } catch (error) {
    console.error('유저 상태 업데이트 오류 터졌슴..', error);
  }
};

// 게임 스타트와 동시에

// 방에 인터벌 매니저가 생성된다.
// >

// 실시간으로 > 위치 변경 노티()를 멀티캐스트로 쏴준다.
// 주기적으로<내부지표 : ? 변수 > > 상태 업데이트 노티()를 멀티캐스트로 쏴준다.
// 일정주기로 <기획상 게임룰 상수: 3분 5분> > 페이즈 변경을 진행하고 페이즈 업데이트 노티()를 멀티캐스트로 쏴준다.

// 다른 이벤트 발생후 필요시 >

// 클라이언트의 유저데이터 상태를 서버와 일치시킨다.

// 1명이라서 상관이 없나? 하는데
// 7명이서 들어와서 동기화 계속 때려주세요. 라고 한다면
// 저거만 들어오는게 아닌데

// >> 애시당초에 때려주세요가 아니라서 리퀘스트 부하는 없을듯.
// 중압집중형 서버 관리방식: *이미 효율적인 방식 채택중*

// 모든 유저의 상태를 한곳에 모아 관리하고
// 각 유저가 자신의 상태를 업데이트 할때 중앙서버에 한번 보내고
// 중앙 서버가 이르 받아 다른유저에게 전파하는것.

// Ex) 유저 A가 자신의 상태를 중앙서버에 업데이트 요청
//       중앙서버는 이 상태를 받아 나머지에게 전파.
//      각 유저는 중앙서버로부터 상태업데이트를 받아 자신의 데이터 갱신

// 결국 근본적으로 명세상 유저 업데이트 싱크의 경우에는
// 어떠한 리퀘스트를 받은 핸들러가 호출에 내 상태를 다른사람에게 알리는 역할에 가깝다.

// 근데 이걸 지금 주기적으로 업데이트를 해주는쪽으로 구현을 했으니
// 부하가 생길수도 있음. 문제가 생기면 싱크주기를 줄이던, 리액션으로만 반응하는 식으로 바꿀수 있음.
