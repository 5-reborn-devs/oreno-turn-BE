import { PACKET_TYPE } from '../../constants/header.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const fleamarketPickHandler = (socket, payload) => {
  const { pickIndex } = payload; // 클라에서 온 픽데이터를 페이로드에서 꺼냄

  // 
  // 요청한 유저에게 플리마켓 픽 응답
  sendResponsePacket(socket, PACKET_TYPE.FLEAMARKET_PICK_RESPONSE, {
    success: true,
    failCode: getFailCode(),
  });
};
