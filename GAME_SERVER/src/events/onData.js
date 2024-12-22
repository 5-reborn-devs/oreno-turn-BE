import { config } from '../config/config.js';
import { TOTAL_LENGTH } from '../constants/header.js';
import { getHandlerByPacketType } from '../handlers/index.js';
import { decoder } from '../utils/response/decoder.js';
import fastq from 'fastq';

//최근 작업을 넣어두는 객체
const recentTasks = new Set();

//RequestWorker : Request큐에 데이터가 들어오는대로 뺴주는 곳.
const RequestWorker = async (task, cb) => {
  const handler = getHandlerByPacketType(task.packetType);
  await handler(task.socket, task.decodedPacket);

  //2초뒤에 set 데이터 제거
  setTimeout(() => {
    recentTasks.delete(task.packetType);
    console.log(`Task ${task.packetType} 제거!`);
  }, 2000);
  cb(null); // 작업 완료 후 콜백 호출
};

//RequestQueue 큐 생성 (worker, 동시 실행 수 1)
const RequestQueue = fastq(RequestWorker, 1);

// RequestQueue push 함수 : 중복 방지
const addRequest = (task) => {
  if (recentTasks.has(task.packetType)) {
    console.log(`Task ${task.packetType} 중복 스킵!!`);
    return;
  }

  // 최근 작업에 추가
  if (task.packetType !== 33 || task.packetType !== 56) {
    recentTasks.add(task.packetType);
  }
  RequestQueue.push(task, (err, result) => {
    if (err) {
      console.error('Task failed:', err);
    } else {
      console.log(result);
    }
  });
};

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  while (socket.buffer.length >= TOTAL_LENGTH) {
    const packetType = socket.buffer.readUInt16BE(0);
    let offset = config.packet.typeLength;
    const versionLength = socket.buffer.readUInt8(offset);
    offset += config.packet.versionLength;
    const version = socket.buffer
      .subarray(offset, offset + versionLength)
      .toString();
    offset += versionLength;
    const sequence = socket.buffer.readUInt32BE(offset);
    offset += config.packet.sequenceLength;
    const payloadLength = socket.buffer.readUInt32BE(offset);
    offset += config.packet.payloadLength;

    // 패킷 전체 길이
    const requiredLength = offset + payloadLength;

    // 전체 패킷 데이터 길이
    if (socket.buffer.length >= requiredLength) {
      // payload를 읽을 곳
      const payload = socket.buffer.subarray(offset, requiredLength);

      // 남은 데이터는 다시 버퍼 데이터에 추가
      socket.buffer = socket.buffer.subarray(requiredLength);
      if (packetType !== 23) {
        console.log('클라가 보낸 패킷타입 request', packetType);
      }

      try {
        // 모든 패킷을 게임패킷으로 처리 가능하다고 한다
        const decodedPacket = decoder(payload);

        const handler = getHandlerByPacketType(packetType);
        socket.queue.addRequest(socket, packetType, decodedPacket, handler);
      } catch (err) {
        console.error(err);
        console.error(
          `패킷처리 에러 : ${err}, packeyType : ${packetType}`,
          versionLength,
          version,
          sequence,
          payloadLength,
          JSON.stringify(payload),
        );
      }
    } else {
      console.log(
        `들어온 데이터 비교 : ${socket.buffer.length}, ${requiredLength}`,
      );
      break;
    }
  }
};
