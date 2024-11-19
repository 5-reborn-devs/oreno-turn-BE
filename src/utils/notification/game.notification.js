import { PACKET_NUMBER, PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { serializer } from '../serilaizer.js';

const makeNotification = (message, type) => {
  const headerBuffer = serializer(message, type, 1);

  return Buffer.concat([headerBuffer, message]);
};

export const fleaMarketUpdateNotification = (cardTypes, pickIndex) => {
  const protoMessages = getProtoMessages();
  const gamePacket = protoMessages.GamePacket;
  const fleaMarketUpdateTypeName =
    PACKET_NUMBER[PACKET_TYPE.FLEAMARKET_NOTIFICATION];

  const payload = {};
  payload[fleaMarketUpdateTypeName] = { cardTypes, pickIndex };
  const fleaMarketUpdatePacket = gamePacket.encode(payload).finish();

  return makeNotification(
    fleaMarketUpdatePacket,
    PACKET_TYPE.FLEAMARKET_NOTIFICATION,
  );
};
