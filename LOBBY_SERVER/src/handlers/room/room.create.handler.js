import { redisManager } from '../../classes/managers/redis.manager.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getNextRoomId } from '../../session/room.session.js';
import { serverSwitch } from '../../utils/notification/notification.serverSwitch.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import net from 'net';
// 비동기적으로 서버 정보를 받아오는 함수
async function assignToGameServer() {
  return new Promise((resolve, reject) => {
    const client = net.createConnection(
      { host: '127.0.0.1', port: 9000 },
      () => {
        // 소켓 연결 후, HAProxy 상태 요청
        client.write('show servers state\n');
      },
    );

    client.on('data', (data) => {
      const stdout = data.toString();
      console.log('HAProxy 응답:', stdout);

      // 서버 정보 파싱
      const serverInfo = parseHAProxyData(stdout);

      if (serverInfo) {
        resolve(serverInfo); // 서버 정보를 반환
      } else {
        reject(new Error('서버 정보 추출 실패'));
      }

      client.end(); // 연결 종료
    });

    client.on('error', (error) => {
      reject(new Error('소켓 오류: ' + error.message));
    });
  });
}

// HAProxy에서 받은 데이터로 서버 정보 파싱
function parseHAProxyData(data) {
  const lines = data.split('\n');
  const serverList = [];

  for (let line of lines) {
    if (line.includes('game_srv')) {
      const parts = line.split(/\s+/); // 공백 기준으로 분리
      const host = parts[4]; // 서버 주소
      const port = parts[18]; // 서버 포트
      serverList.push({ host, port });
    }
  }
  return serverList; // 배열 형태로 반환
}

export const createRoomHandler = async (socket, payloadData) => {
  const protoMessages = getProtoMessages();
  const roomStateType = protoMessages.enum.RoomStateType.values;
  const { name, maxUserNum } = payloadData;
  const failCode = getFailCode();

  let createRoomResponse;
  //게임 서버 정보 받아오기 (비동기 처리)
  const serverList = await assignToGameServer();
  console.log('서버리스트', serverList);
  const serverInfo = serverList[0];
  console.log('서버인포', serverInfo);
  try {
    const user = await redisManager.users.get(socket.token);

    // 방 번호 할당
    const roomId = getNextRoomId();
    const room = {
      id: roomId,
      ownerId: user.id,
      name: name,
      maxUserNum: maxUserNum,
      state: roomStateType.WAIT,
    };

    redisManager.rooms.addRoom(roomId, room); // 방 생성
    redisManager.rooms.addUser(roomId, user); // 방에 유저 추가
    redisManager.users.setRoomId(socket.token, roomId); // 유저 정보에 방 번호 저장
    socket.roomId = roomId;

    createRoomResponse = {
      success: true,
      room: room,
      failCode: failCode.NONE_FAILCODE,
    };
  } catch (error) {
    createRoomResponse = {
      success: false,
      room: null,
      failCode: failCode.CREATE_ROOM_FAILED,
    };

    console.error('방 생성 실패: ', error);
  }

  sendResponsePacket(socket, PACKET_TYPE.CREATE_ROOM_RESPONSE, {
    createRoomResponse,
  });
  socket.isEndIgnore = true;

  //게임 서버 정보 출력
  console.log('호스트:', serverInfo.host);
  console.log('포트:', serverInfo.port);
  // const testHost = '127.0.0.1';
  // const testPort = 6666;
  // 서버 스위치
  serverSwitch(socket, serverInfo.host, serverInfo.port);
};
