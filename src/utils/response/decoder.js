import { getProtoMessages } from '../../init/loadProto.js';

export const decoder = (payloadData) => {
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
