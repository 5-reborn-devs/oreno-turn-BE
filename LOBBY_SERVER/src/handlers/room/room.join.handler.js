import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { getUsersWithoutMe } from '../../session/room.session.js';
import { redisManager } from '../../classes/managers/redis.manager.js';
import { serverSwitch } from '../../utils/notification/notification.serverSwitch.js';
import { config } from '../../config/config.js';
import { redisClient } from '../../init/redisConnect.js';

export const joinRoomHandler = async (socket, payload) => {
  const { roomId } = payload;
  const failCode = getFailCode();
  const rooms = redisManager.rooms;
  let joinRoomResponse;
  let notification;
  const roomPort = await redisClient.hget(roomId, 'roomPort');
  try {
    const user = await redisManager.users.get(socket.token);
    const usersInRoomWithoutMe = await rooms.getUsers(roomId);
    await rooms.addUser(roomId, user, socket.token);
    await redisManager.users.setRoomId(socket.token, roomId);
    const room = await rooms.getRoomData(roomId);

    if (!roomPort) {
      throw new Error(`룸아이디에 포트값이없어요!! 방번호:${roomId}`);
    }

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
  socket.isEndIgnore = true;

  // 서버를 옮김
  serverSwitch(socket, config.server.host, Number(roomPort));
};
