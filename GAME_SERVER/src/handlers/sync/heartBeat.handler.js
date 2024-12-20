import { PACKET_TYPE } from '../../constants/header.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const heartBeatHandler = async (socket, payload) => {
  let pongResponse;
  try {
    const { message, timestamp } = payload;
    // long타입을 int형식으로 변환
    const combinedTimestamp = timestamp.low + timestamp.high * 0x100000000;
    console.log(`클라가 ping보낸 시간 : ${combinedTimestamp} `);
    pongResponse = {
      message: 'Pong',
      timestamp: Date.now(),
    };
  } catch (err) {
    console.error('하트비트에러');
  }
  sendResponsePacket(socket, PACKET_TYPE.PONG_RESPONSE, {
    pongResponse,
  });
};
