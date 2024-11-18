<<<<<<< HEAD
import { PACKET_NUMBER, SEQUENCE_SIZE, TOTAL_LENGTH, VERSION_START } from '../constants/header.js';
import { getHandlerByPacketType } from '../handler/index.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);
  const initialHeaderLength = VERSION_START;

  while (socket.buffer.length > initialHeaderLength) {
    console.log(socket.buffer);

    const packetType = socket.buffer.readUInt16BE(0);
    console.log(`packetType: ${PACKET_NUMBER[packetType]}`);

    const versionLength = socket.buffer.readUInt8(2);
    const totalHeaderLength = TOTAL_LENGTH + versionLength;

    while (socket.buffer.length >= totalHeaderLength) {
      const version = socket.buffer.toString('utf8', VERSION_START, VERSION_START + versionLength);

      // sequence: 4바이트 읽기
      const sequence = socket.buffer.readUInt32BE(VERSION_START + versionLength);

      // payloadLength: 4바이트 읽기
      const payloadLengthPosition = VERSION_START + versionLength + SEQUENCE_SIZE;
      const payloadLength = socket.buffer.readUInt32BE(payloadLengthPosition);

      // 패킷의 전체 길이 (헤더와 payload 길이를 포함)
      const length = totalHeaderLength + payloadLength;
      if (socket.buffer.length >= length) {
        // 헤더부터 끝까지
        const payloadStart = totalHeaderLength;
        let payload = socket.buffer.subarray(payloadStart, payloadStart + payloadLength);

        socket.buffer = socket.buffer.subarray(length);
        try {
          const handler = getHandlerByPacketType(packetType);
          handler({ socket, payload });
        } catch (error) {
          console.error(error);
        }
      } else {
        break;
      }
      break;
    }
=======
/* 
  명세
  [ PayloadOneofCase ] [ versionLength ] [ version ] [ sequence ] [ payloadLength ] [ payload ]
  2 bytes              1 bytes         versionLength 4 bytes      4 bytes         payloadLength 
  C2S = 리틀 엔디안
  S2C = 빅 엔디안

  const PAYLOAD_ONEOF_CASE_SIZE = 2;
  const VERSION_LENGTH_SIZE = 1;
  const SEQUENCE_SIZE = 4;
  const PAYLOAD_LENGTH_SIZE = 4;
-------------------------------------------------------------
  const PACKET_TYPE_LENGTH = 2;     // PayloadOneofCase
  const VERSION_START = 1;          // versionLength (version)
  const SEQUENCE_SIZE = 4;          // sequence
  const PAYLOAD_LENGTH_SIZE = 4;    // payloadLength 
*/

import { config } from "../config/config.js";
import {
  TOTAL_LENGTH,
  PACKET_TYPE_LENGTH,
  VERSION_START,
  VERSION_LENGTH,
  SEQUENCE_SIZE, 
  PAYLOAD_LENGTH_SIZE
} from "../constants/header.js";
import { getHandlerByHandlerId } from "../handlers/index.js";
import { getProtoMessages } from "../init/loadProto.js";
import { decoder } from "../utils/response/decoder.js";

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 정의된 패킷 헤더 명세
  // const headerSize = PACKET_TYPE_LENGTH + VERSION_START + SEQUENCE_SIZE + PAYLOAD_LENGTH_SIZE;
  // const headerSize = config.packet.totalLength + config.packet.typeLength;

  // 버퍼 데이터로 들어온 패킷 데이터가 헤더 길이보다 크다면 ( 데이터가 들어왔다고 이해 )
  while (socket.buffer.length >= VERSION_START) {
    console.log(socket.buffer);
    // 버퍼 데이터 중 PayloadOneofCase 길이만큼 할당 2byte
    const packetType = socket.buffer.readUInt16BE(0);
    let offset = config.packet.typeLength; 
    console.log("1번 오프셋",offset);
    // 1byte만큼 versionLength순서부터 할당 :packetType 다음 순서
    const versionLength = socket.buffer.readUInt8(offset);  
    offset += config.packet.versionLength; 
    console.log("2번 오프셋",offset);
    // version을 읽을 곳 4byte (문자열로 반환받기)
    // 헤더에는 3으로 되어있어서 일단 3byte 읽어오기
    // 만약 4byte일 경우에는 VERSION_START + versionLength 만큼 읽기
    const version = socket.buffer.subarray(offset, versionLength).toString();
    // offset += VERSION_START + versionLength;
    // 만약 1byte 이면 offset += versionLength; 만 해주기
    offset += versionLength;
    console.log("3번 오프셋",offset);
    // 4byte sequence를 읽을 곳 : version 다음 순서
    const sequence = socket.buffer.readUInt32BE(offset);
    offset += config.packet.sequenceLength;
    console.log("4번 오프셋",offset);
    // 4byte payloadLength를 읽을 곳 : sequence 다음 순서
    const payloadLength = socket.buffer.readUInt32BE(offset);
    offset += config.packet.payloadLength;
    console.log("5번 오프셋",offset);
    
    // 패킷 전체 길이
    const requiredLength = offset + payloadLength;

    // 전체 패킷 데이터 길이
    if (socket.buffer.length >= requiredLength) {
      // payload를 읽을 곳 
      const payload = socket.buffer.subarray(offset, requiredLength);

      // 남은 데이터는 다시 버퍼 데이터에 추가
      socket.buffer = socket.buffer.subarray(requiredLength);
      console.log(`페이로드 : ${payload}`);

      try {
        console.log(`패킷 타입 : ${packetType}`);
        console.log(`버전 : ${version}`);
        console.log(`시퀸스 : ${sequence}`);
        console.log(`패킷길이 : ${requiredLength}`);
        // 모든 패킷을 게임패킷으로 처리 가능하다고 한다
        const decodedPacket = decoder(packetType, payload);

        // 인자로 받을 패킷 타입 전송
        const handler = getHandlerByHandlerId(packetType);
        if (handler) {
          await handler(socket, decodedPacket);
        }
      } catch (err) {
        console.error(`패킷처리 에러 : `, err);
      }
    } else {
      console.log(`들어온 데이터 비교 : ${socket.buffer.length}, ${requiredLength}`);
      break;
    }
    
>>>>>>> 4d66abf1c14163c45a75a4b5faf87006ebdb7b97
  }
};
