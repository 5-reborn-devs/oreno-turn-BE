import { PACKET_TYPE } from "../../constants/header.js";
import { getProtoMessages } from "../../init/loadProto.js";

export const fleamarketPickHandler = ({ socket, payload }) => {
  const protoMessages = getProtoMessages();
  const requestData = protoMessages.request.C2SFleaMarketPickRequest
  const pickIndex = requestData.decode(payload)

  // 선택한 카드가 있는지 검증하기
  if(!pickIndex) {
    console.error('카드 번호가 존재하지 않습니다.')
  }


  const result = sendResponsePacket(socket, PACKET_TYPE.FLEAMARKET_PICK_RESPONSE, {
    success: true,
    failCode: 0,
  })
  ;
  return result;
};

