
//명세
// [ PayloadOneofCase ] [ versionLength ] [ version ] [ sequence ] [ payloadLength ] [ payload ]
// 2 bytes              1 bytes         versionLength 4 bytes      4 bytes         payloadLength 
// C2S = 리틀 엔디안
// S2C = 빅 엔디안

// const PAYLOAD_ONEOF_CASE_SIZE = 2;
// const VERSION_LENGTH_SIZE = 1;
// const SEQUENCE_SIZE = 4;
// const PAYLOAD_LENGTH_SIZE = 4;

import { config } from "../config/config.js";
import {
  PACKET_TYPE_LENGTH,
  PAYLOAD_LENGTH_SIZE, 
  SEQUENCE_SIZE, 
  VERSION_START
} from "../constants/header.js";
import { getHandlerByHandlerId } from "../handlers/index.js";
import { getProtoMessages } from "../init/loadProto.js";


const PACKET_TYPE_LENGTH = 2;     // PayloadOneofCase
const VERSION_START = 1;          // versionLength (version)
const SEQUENCE_SIZE = 4;          // sequence
const PAYLOAD_LENGTH_SIZE = 4;    // payloadLength

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const headerSize = PACKET_TYPE_LENGTH + VERSION_START + SEQUENCE_SIZE + PAYLOAD_LENGTH_SIZE;
  //const headerSize = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= headerSize) {

    // 버퍼 데이터 중 PayloadOneofCase 길이만큼 할당 2byte
    const payloadOneofCase = socket.buffer.readUInt16BE(0);

    // 1byte만큼 versionLength순서부터 할당 :payloadOneofCase 다음 순서
    const versionLength = socket.buffer.readUInt8(PACKET_TYPE_LENGTH);

    const totalHeaderLength = headerSize + versionLength;


    // version을 읽을 곳 4byte (문자열로 반환받기 위한 인코딩)
    const versionOffset = PACKET_TYPE_LENGTH + VERSION_START;
    const version = socket.buffer.toString('utf-8', versionOffset, versionOffset + versionLength);

    // sequence를 읽을 곳 : version 다음 순서
    const sequence = socket.buffer.readUInt32BE(SEQUENCE_SIZE);

    // payloadLength를 읽을 곳 : sequence 다음 순서
    const payloadLength = socket.buffer.readUInt32BE(PAYLOAD_LENGTH_SIZE);

    // 패킷 전체 길이
    const packetLength = totalHeaderLength + payloadLength;

    // 
    if (socket.buffer.length >= payloadLength) {

      // payload를 읽을 곳 
      const payload = socket.buffer.slice(totalHeaderLength, packetLength);

      // 남은 데이터는 다시 퍼버 데이터에 추가
      socket.buffer = socket.buffer.slice(packetLength);

      console.log(`패킷 타입 : ${getPacketTypeName(payloadOneofCase)}`);
      console.log(`버전 : ${version}`);
      console.log(`시퀸스 : ${sequence}`);
      console.log(`패킷길이 : ${packetLength}`);
      console.log(`페이로드 : ${payload}`);

      try {
        const handler = getHandlerByHandlerId(payloadOneofCase);
        if (handler) {
          await handler(socket);
        }
      } catch (err) {
        console.error(err);
      }
    }
    
  }
};
