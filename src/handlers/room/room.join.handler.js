import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { getUsersWithoutMe } from '../../session/room.session.js';
import { redisManager } from '../../classes/managers/redis.manager.js';

export const joinRoomHandler = async (socket, payload) => {
  const { roomId } = payload;
  const failCode = getFailCode();
  const rooms = redisManager.rooms;
  let joinRoomResponse;
  let notification;

  try {
    const user = await redisManager.users.get(socket.token);
    const usersInRoomWithoutMe = await rooms.getUsers(roomId);
    rooms.addUser(roomId, user);

    const room = await rooms.getRoomData(roomId);
    console.log('room', room);

    socket.roomId = roomId;
    joinRoomResponse = {
      success: true,
      room: room,
      failCode: failCode.NONE_FAILCODE,
    };
    const joinRoomNotification = { joinUser: user };

    notification = [
      usersInRoomWithoutMe,
      PACKET_TYPE.JOIN_ROOM_NOTIFICATION,
      {
        joinRoomNotification,
      },
    ];
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
  if (notification) multiCast(...notification);
};
