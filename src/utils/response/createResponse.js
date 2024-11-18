import { PACKET_NUMBER } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { serializer } from '../serilaizer.js';

const sendResponsePacket = (socket, packetType, responseMessage) => {
  try {
    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.gamePacket.GamePacket;

    const responseGamePacket = GamePacket.create(responseMessage);
    const gamePacketBuffer = GamePacket.encode(responseGamePacket).finish();

    // 정규화 과정을 통해 패킷 제작
    const serializedPacket = serializer(gamePacketBuffer, packetType);

    //클라이언트에게 패킷 전송
    socket.write(serializedPacket);

    console.log(`Sent packet of type ${PACKET_NUMBER[packetType]} to client.`);
  } catch (error) {
    console.error('Error sending response packet', error);
  }
};

export default sendResponsePacket;
