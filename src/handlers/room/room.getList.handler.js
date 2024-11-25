import { PACKET_TYPE } from '../../constants/header.js';
import { rooms } from '../../session/session.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';

export const getRoomListHandler = async (socket, payloadData) => {
  try {
    const getRoomListResponse = {
      rooms: [...rooms.values()],
    };

    sendResponsePacket(socket, PACKET_TYPE.GET_ROOM_LIST_RESPONSE, {
      getRoomListResponse,
    });
  } catch (error) {
    console.error('방 리스트 가져오기 실패', error);
  }
};
