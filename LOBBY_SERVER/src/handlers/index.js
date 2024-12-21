import { PACKET_TYPE } from '../constants/header.js';
import { loginHandler } from './auth/login.handler.js';
import { registerHandler } from './auth/register.handler.js';
import { createRoomHandler } from './room/room.create.handler.js';
import { getRoomListHandler } from './room/room.getList.handler.js';
import { joinRoomHandler } from './room/room.join.handler.js';
import { joinRandomRoomHandler } from './room/room.joinRandom.handler.js';
import { verifyTokenHandler } from './auth/verifyToken.handler.js';
import { leaveRoomHandler } from './room/room.leave.handler.js';

const handlers = {
  [PACKET_TYPE.REGISTER_REQUEST]: {
    handler: registerHandler,
    protoType: 'request.C2SRegisterRequest',
  },
  [PACKET_TYPE.LOGIN_REQUEST]: {
    handler: loginHandler,
    protoType: 'request.C2SLoginRequest',
  },
  [PACKET_TYPE.GET_ROOM_LIST_REQUEST]: {
    handler: getRoomListHandler,
    protoType: 'request.C2SGetRoomListRequest',
  },
  [PACKET_TYPE.JOIN_ROOM_REQUEST]: {
    handler: joinRoomHandler,
    protoType: 'request.C2SJoinRoomRequest',
  },
  [PACKET_TYPE.JOIN_RANDOM_ROOM_REQUEST]: {
    handler: joinRandomRoomHandler,
    protoType: 'request.C2SJoinRandomRoomRequest',
  },
  [PACKET_TYPE.CREATE_ROOM_REQUEST]: {
    handler: createRoomHandler,
    protoType: 'request.C2SCreateRoomRequest',
  },
  [PACKET_TYPE.VERIFY_TOKEN_REQUEST]: {
    handler: verifyTokenHandler,
    protoType: 'request.C2SVerifyTokenReqeset',
  },
  [PACKET_TYPE.LEAVE_ROOM_REQUEST]: {
    handler: leaveRoomHandler,
    protoType: 'request.C2SLeaveRoomRequest',
  },
};

export const getHandlerByPacketType = (packetType) => {
  const handler = handlers[packetType];
  if (!handler) {
    if (!PACKET_TYPE[packetType]) return () => {}; // 다른 서버의 기능이 호출된 경우
    throw Error(`알 수 없는 패킷타입: ${packetType}`);
  }
  return handler.handler;
};

export const getHandlerByHandlerId = (packetType) => {
  if (!handlers[packetType]) {
    throw Error();
  }
  return handlers[packetType].protoType;
};
