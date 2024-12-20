import { PACKET_TYPE } from '../../constants/header.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const heartBeatHandler = async (socket, payload) => {
  let pongResponse;
  try {
    const { message, timestamp } = payload;
    // long타입을 int형식으로 변환
    const combinedTimestamp = timestamp.toNumber();
    const localTime = Date.now();
    const timeDifference = localTime - combinedTimestamp;
    console.log(`클라가 ping보낸 시간 : ${combinedTimestamp} `);
    console.log(`현재시간${localTime}`);
    console.log(`시간 차이 : ${timeDifference}`);
    pongResponse = {
      message: 'Pong',
      timestamp: new Date().getTime(),
    };
  } catch (err) {
    console.error('하트비트에러');
  }
  sendResponsePacket(socket, PACKET_TYPE.PONG_RESPONSE, {
    pongResponse,
  });
};
