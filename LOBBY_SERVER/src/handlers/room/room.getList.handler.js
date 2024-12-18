import { redisManager } from '../../classes/managers/redis.manager.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';

export const getRoomListHandler = async (socket, payloadData) => {
  const protoMessages = getProtoMessages();
  const inGameState = protoMessages.enum.RoomStateType.values['INGAME'];

  try {
    const rooms = await redisManager.rooms.getRooms();
    const getRoomListResponse = {
      rooms: rooms.filter((room) => room.state != String(inGameState)),
    };

    sendResponsePacket(socket, PACKET_TYPE.GET_ROOM_LIST_RESPONSE, {
      getRoomListResponse,
    });
  } catch (error) {
    console.error('방 리스트 가져오기 실패', error);
  }
};
