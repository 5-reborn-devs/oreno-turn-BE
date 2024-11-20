import { PACKET_TYPE } from '../constants/header.js';
import { login } from './auth/login.handler.js';
import { registerHandler } from './auth/register.handler.js';
import { gamePrepare } from './game/gamePrepare.handler.js';
import { gameStart } from './game/gameStart.handler.js';
import { createRoomHandler } from './room/room.create.handler.js';
import { fleamarketPickHandler } from './fleamarket/fleamarketPick.handler.js';
import { useCardHandler } from './card/useCard.handler.js';

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

  // 게임 관련 핸들러
  [PACKET_TYPE.CREATE_ROOM_REQUEST]: {
    handler: createRoomHandler, // 사용하게될 함수명
    protoType: 'request.C2SCreateRoomRequest',
  },
  [PACKET_TYPE.GAME_PREPARE_REQUEST]: {
    handler: gamePrepare, // 사용하게될 함수명
    protoType: 'request.C2SGamePrepareRequest',
  },
  [PACKET_TYPE.GAME_START_REQUEST]: {
    handler: gameStart, // 사용하게될 함수명
    protoType: 'request.C2SGameStartRequest',
  },
  [PACKET_TYPE.USE_CARD_REQUEST]: {
    handler: useCardHandler, // 사용하게될 함수명
    protoType: 'request.C2SUseCardRequest',
  },
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
