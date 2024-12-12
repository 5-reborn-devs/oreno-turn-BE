import _ from 'lodash';
import { getEmptyRooms, getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { users } from '../../session/session.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { redisManager } from '../../classes/managers/redis.manager.js';
import { joinRoomHandler } from './room.join.handler.js';

export const joinRandomRoomHandler = async (socket) => {
  const failCode = getFailCode();
  const rooms = redisManager.rooms;
  let joinRoomResponse;

  try {
    const emptyRooms = await rooms.getEmptyRooms(); // 룸 리스트에서 자리 있는 방을 골라냄.

    if (!emptyRooms) {
      throw new Error('[랜덤 방입장]빈방이 없습니다.');
    }
    const roomId = _.sample(emptyRooms); // 빈방 리스트에서 랜덤하게 골라냄.

    // 방 입장 진행
    joinRoomHandler(socket, { roomId });
  } catch (error) {
    joinRoomResponse = {
      success: false,
      room: null,
      failCode: failCode.JOIN_ROOM_FAILED,
    };

    console.error(error);

    sendResponsePacket(socket, PACKET_TYPE.JOIN_ROOM_RESPONSE, {
      joinRoomResponse,
    });
  }
};
