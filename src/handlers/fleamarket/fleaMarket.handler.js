import { PACKET_TYPE } from "../../constants/header.js";
import sendResponsePacket from "../../utils/response/createResponse.js";

export const fleamarketPickHandler = ({ socket, payload }) => {
  const { pickIndex } = payload;

  // 선택한 카드가 있는지 검증하기
  if(!pickIndex) {
    console.error('카드 번호가 존재하지 않습니다.')
  }

  // 요청한 유저에게 플리마켓 픽 응답
  const result = sendResponsePacket(socket, PACKET_TYPE.FLEAMARKET_PICK_RESPONSE, {
    success: true,
    failCode: 0,
  })
  

};
