import { redisManager } from '../../classes/managers/redis.manager.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';

export const getRoomListHandler = async (socket, payloadData) => {
  const protoMessages = getProtoMessages();
  const inWaitState = protoMessages.enum.RoomStateType.values['WAIT'];

  try {
    const rooms = await redisManager.rooms.getRooms();
    const readyRooms = rooms.filter((room) => room.state == inWaitState);
    const getRoomListResponse = {
      rooms: readyRooms,
    };

    sendResponsePacket(socket, PACKET_TYPE.GET_ROOM_LIST_RESPONSE, {
      getRoomListResponse,
    });
  } catch (error) {
    console.error('방 리스트 가져오기 실패', error);
  }
};
