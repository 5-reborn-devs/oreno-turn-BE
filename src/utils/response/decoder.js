import { PACKET_NUMBER } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import camelCase from 'lodash/camelCase.js';

export const decoder = (packetType, payloadData) => {
  try {
    const protoMessages = getProtoMessages();
    const GamePacket = protoMessages.gamePacket.GamePacket;

    const gamePacket = GamePacket.decode(payloadData);

    const request = Object.values(gamePacket)[0];
    return request;
  } catch (error) {
    console.error(error);
  }
};
