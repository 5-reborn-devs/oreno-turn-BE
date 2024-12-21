import { PACKET_TYPE } from '../../constants/header.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

const PING_TIMEOUT = 10000; // 타임아웃 시간 10초 (10000ms)
let lastPingTime = Date.now(); // 마지막 ping 시간을 기록

// 클라이언트 연결이 끊어진다고 가정한 타이머
let pingTimeout;

export const heartBeatHandler = async (socket, payload) => {
  let pongResponse;
  try {
    const { message, timestamp } = payload;
    const combinedTimestamp = timestamp.toNumber();
    const localTime = new Date().getTime();
    const timeDifference = localTime - combinedTimestamp;

    console.log(`클라가 ping보낸 시간 : ${combinedTimestamp}`);
    console.log(`현재시간 : ${localTime}`);
    console.log(`시간 차이 : ${timeDifference}`);

    // 클라이언트로부터 ping을 받은 시간 업데이트
    lastPingTime = Date.now();

    // pong 응답 보내기
    pongResponse = {
      message: 'success',
      timestamp: localTime,
    };

    sendResponsePacket(socket, PACKET_TYPE.PONG_RESPONSE, {
      pongResponse,
    });
    setTimeout(async () => {
      if (success) {
        users.get(socket.token).isEndIgnore = true;
        serverSwitch(socket, '127.0.0.1', 6666);
      }
    }, 100);
    // ping 응답 후 타이머 리셋
    resetPingTimeout(socket);
  } catch (err) {
    console.error('하트비트 에러');
  }
};

// 클라이언트로부터 일정 시간동안 ping이 오지 않으면 연결 끊기
const resetPingTimeout = (socket) => {
  clearTimeout(pingTimeout); // 이전 타이머 클리어

  pingTimeout = setTimeout(() => {
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastPingTime;

    // 제한 시간을 초과하면 연결 끊기
    if (timeElapsed > PING_TIMEOUT) {
      console.log(
        `클라이언트가 일정 시간 동안 응답하지 않아 연결을 종료합니다.`,
      );
      // 실패 메시지 전송 후 연결 종료
      sendResponsePacket(socket, PACKET_TYPE.PONG_RESPONSE, {
        message: 'fail',
      });
    }
  }, PING_TIMEOUT); // 타임아웃 시간만큼 대기
};
