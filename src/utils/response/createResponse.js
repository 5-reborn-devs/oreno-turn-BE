import { PACKET_NUMBER } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { clients } from '../../session/session.js';
import { serializer } from '../serilaizer.js';

export const sendResponsePacket = (socket, packetType, responseMessage) => {
  try {
    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.gamePacket.GamePacket;

    const responseGamePacket = GamePacket.create(responseMessage);
    const gamePacketBuffer = GamePacket.encode(responseGamePacket).finish();

    // 정규화 과정을 통해 패킷 제작
    const serializedPacket = serializer(gamePacketBuffer, packetType);

    //클라이언트에게 패킷 전송
    socket.write(serializedPacket);

    // console.log(`Sent packet of type ${PACKET_NUMBER[packetType]} to client.`);
  } catch (error) {
    console.error('Error sending response packet', error);
  }
};

export const multiCast = (users, packetType, message) => {
  users.forEach((user) => {
    const client = clients.get(user.id);
    console.log([...clients.keys()], user.id);
    sendResponsePacket(client, packetType, message);
  });
};

export default sendResponsePacket;
