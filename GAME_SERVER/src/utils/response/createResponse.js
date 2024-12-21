import User from '../../classes/models/user.class.js';
import { PACKET_NUMBER } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { clients } from '../../session/session.js';
import { serializer } from '../serilaizer.js';
import fastq  from 'fastq';

//ResponseWorker : Response큐에 데이터가 들어오는대로 뺴주는 곳.
const ResponseWorker = async (task, cb) => {
  // console.log(`Processing task: ${task.name}`);
  await task.socket.write(task.serializedPacket);
   cb(null);  // 작업 완료 후 콜백 호출
 };

//ResponseQueue 큐 생성 
const ResponseQueue = fastq(ResponseWorker, 1);

console.log('Waiting tasks:', ResponseQueue.length());  // 현재 큐에 쌓인 작업 수
console.log('Running tasks:', ResponseQueue.running());  // 현재 실행 중인 작업 수

ResponseQueue.drain = () => {
  console.log('All tasks completed!');
};

export const sendResponsePacket = (socket, packetType, responseMessage) => {
  try {
    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.gamePacket.GamePacket;

    const responseGamePacket = GamePacket.create(responseMessage);
    const gamePacketBuffer = GamePacket.encode(responseGamePacket).finish();

    // 정규화 과정을 통해 패킷 제작
    const serializedPacket = serializer(gamePacketBuffer, packetType);

    // //클라이언트에게 패킷 전송
    // socket.write(serializedPacket);

    //리스폰스 큐에 데이터 삽입
    ResponseQueue.push({socket,serializedPacket});

    // console.log(`Send packet of type ${PACKET_NUMBER[packetType]} to client.`);
  } catch (error) {
    console.error('sendPacket Error Payload:', JSON.stringify(responseMessage));
    console.error('Error sending response packet', error);
  }
};

export const multiCast = (users, packetType, message) => {
  if (users[0] instanceof User) {
    users.forEach((user) => {
      if (user.id) {
        const client = clients.get(user.id);
        sendResponsePacket(client, packetType, message);
      }
    });
  } else {
    users.forEach((id) => {
      if (id !== '') {
        const client = clients.get(Number(id));
        sendResponsePacket(client, packetType, message);
      }
    });
  }
};

export default sendResponsePacket;
