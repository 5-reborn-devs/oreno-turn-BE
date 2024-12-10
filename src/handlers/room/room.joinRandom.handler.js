import _ from 'lodash';
import { getEmptyRooms, getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { users } from '../../session/session.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { redisManager } from '../../classes/managers/redis.manager.js';

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
    // room 유효검사

    const user = await redisManager.users.get(socket.token);
    rooms.addUser(roomId, user);
    socket.roomId = roomId;

    const room = await rooms.getRoomData(roomId);
    joinRoomResponse = {
      success: true,
      room: room,
      failCode: failCode.NONE_FAILCODE,
    };

    const joinRoomNotification = { joinUser: user };

    const usersInRoom = await rooms.getUsers(roomId);
    multiCast(usersInRoom, PACKET_TYPE.JOIN_ROOM_NOTIFICATION, {
      joinRoomNotification,
    }); // 다른 유저에게 입장을 알림.
  } catch (error) {
    joinRoomResponse = {
      success: false,
      room: null,
      failCode: failCode.JOIN_ROOM_FAILED,
    };

    console.error(error);
  }

  sendResponsePacket(socket, PACKET_TYPE.JOIN_ROOM_RESPONSE, {
    joinRoomResponse,
  });
};
