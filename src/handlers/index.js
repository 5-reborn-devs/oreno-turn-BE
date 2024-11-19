import { PACKET_TYPE } from '../constants/header.js';
import { login } from './auth/login.handler.js';
import { registerHandler } from './auth/register.handler.js';
import { fleamarketPickHandler } from './fleamarket/fleaMarket.handler.js';

const handlers = {
  // 회원가입
  [PACKET_TYPE.REGISTER_REQUEST]: {
    handler: registerHandler, // 사용하게될 함수명
    protoType: 'request.C2SRegisterRequest', // protobuf 타입
  },
  [PACKET_TYPE.LOGIN_REQUEST]: {
    handler: login, // 사용하게될 함수명
    protoType: 'request.C2SLoginRequest', // protobuf 타입
  },
  [PACKET_TYPE.USE_CARD_REQUEST]: {
      handler : register, // 사용하게될 함수명
      protoType : 'request.C2SCreateRoomRequest', // protobuf 타입
  },
  // [PACKET_TYPE.GET_ROOM_LIST_REQUEST]: {
  //     handler : register, // 사용하게될 함수명
  //     protoType : 'request.C2SGetRoomListRequest', // protobuf 타입
  // },
  [PACKET_TYPE.FLEAMARKET_PICK_REQUEST]: {
      handler : fleamarketPickHandler, // 사용하게될 함수명
      protoType : 'request.C2SFleaMarketPickRequest', // protobuf 타입
  },
};

export const getHandlerByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    throw Error();
  }
  return handlers[packetType].handler;
};

export const getHandlerByHandlerId = (packetType) => {
  if (!handlers[packetType]) {
    throw Error();
  }
  return handlers[packetType].protoType;
};
