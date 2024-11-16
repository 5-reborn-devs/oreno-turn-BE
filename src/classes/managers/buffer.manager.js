import { PACKET_NUMBER } from '../../constants/header';
import { getProtoMessages } from '../../init/loadProto';
import camelCase from 'lodash/camelCase.js';
import { serializer } from '../../utils/serilaizer';

const protoMessages = getProtoMessages();
const response = protoMessages.gamePacket.GamePacket;

export const bufferManager = {
  // 요청 받은 페이로드 데이터를 디코드함.
  decoder: (packetType, payloadData) => {
    try {
      const typeName = PACKET_NUMBER[packetType];
      const paketName = 'C2S' + camelCase('tmp_' + typeName).slice(3);
      const request = protoMessages.request[paketName];

      return request.decode(payloadData);
    } catch (error) {
      throw new Error('payload decode error:', error);
    }
  },
  // 보낼 데이터를 디코드해 패킷을 생성함.
  encoder: (packetType, payloadData) => {
    try {
      const typeName = PACKET_NUMBER[packetType];
      const key = camelCase(typeName);

      const message = {};
      message[key] = payloadData;

      const packet = response.encode(message).finish();
      return serializer(packet, packetType);
    } catch (error) {
      throw new Error('message encode and create Packet Error:', error);
    }
  },
  failCode: protoMessages.common.GlobalFailCode,
};
