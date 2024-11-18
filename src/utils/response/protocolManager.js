import { PACKET_NUMBER } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import camelCase from 'lodash/camelCase.js';
import { serializer } from '../serilaizer.js';



// 요청 받은 페이로드 데이터를 디코드함.

// 보낼 데이터를 디코드해 패킷을 생성함.
export const sendResponsePacket = (packetType, payloadData) => {
  try {
    const protoMessages = getProtoMessages();
    const response = protoMessages.gamePacket.GamePacket;
    const typeName = PACKET_NUMBER[packetType];
    const key = camelCase(typeName);

    const message = {};
    message[key] = payloadData;

    const packet = response.encode(message).finish();
    const serializedPacket = serializer(packet, packetType);
    socket.write(serializedPacket);

    console.log(
      `Sent packet of type ${PACKET_NUMBER[packetType]} to client.`,
    );
  } catch (error) {
    console.error('Error sending response packet', error);
  }
}

