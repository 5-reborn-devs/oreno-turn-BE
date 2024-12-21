import { PACKET_NUMBER } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { responseQueue } from '../../qclass.js';
import { clients } from '../../session/session.js';
import { serializer } from '../serilaizer.js'; 

const processResponseQueue = async () => { 
    
  if (!responseQueue.isEmpty()) { 

    const data = responseQueue.dequeue(); // 큐에서 데이터 추출

    //console.log("리스폰스 큐에 들어왔다 나가요!!!",data);

    if (data.socket && data.serializedPacket) {
      //클라이언트에게 패킷 전송
      data.socket.write(data.serializedPacket);
      console.log("ResponseQueue - 패킷 전송 성공");
    }

    }setImmediate(processResponseQueue); // 다음 틱에 큐를 처리하도록 예약 
    }; 
    // 초기 호출 
    setImmediate(processResponseQueue);


export const sendResponsePacket = (socket, packetType, responseMessage) => {
  try {
    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.gamePacket.GamePacket;

    const responseGamePacket = GamePacket.create(responseMessage);
    const gamePacketBuffer = GamePacket.encode(responseGamePacket).finish();

    // 정규화 과정을 통해 패킷 제작
    const serializedPacket = serializer(gamePacketBuffer, packetType);
    console.log("나가는 패킷타입 체크",packetType);

     responseQueue.enqueue({socket,serializedPacket});
     console.log("리스폰스큐 체크",responseQueue);
    //클라이언트에게 패킷 전송
    //  socket.write(serializedPacket);

    console.log(`Send packet of type ${PACKET_NUMBER[packetType]} to client.`);
  } catch (error) {
    console.error('Error sending response packet', error);
  }
};

export const multiCast = (users, packetType, message) => {
  users.forEach((user) => {
    const client = clients.get(user.id);
    sendResponsePacket(client, packetType, message);
  });
};

export default sendResponsePacket;
