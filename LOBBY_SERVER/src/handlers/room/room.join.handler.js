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
import { getRoomListHandler } from './room.getList.handler.js';

export const joinRoomHandler = async (socket, payload) => {
  const { roomId } = payload;
  const failCode = getFailCode();
  const rooms = redisManager.rooms;
  let joinRoomResponse;
  let notification;
  let roomPort = await redisClient.hget(roomId, 'roomPort');
  try {
    const user = await redisManager.users.get(socket.token);
    const usersInRoomWithoutMe = await rooms.getUsers(roomId);
    await rooms.addUser(roomId, user, socket.token);
    await redisManager.users.setRoomId(socket.token, roomId);
    const room = await rooms.getRoomData(roomId);

    if (!room) {
      throw new Error(`방정보가 없습니다. 방번호:${roomId}`);
    }
    if (room.state != 0) {
      throw new Error(`이미 시작한 방입니다.`);
    }
    if (!roomPort) {
      throw new Error(`룸아이디에 포트값이없어요!! 방번호:${roomId}`);
      // console.error(`룸아이디에 포트값이없어요!! 방번호:${roomId}`);
      // roomPort = 16666; // 하드코딩 강제 지정
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

    sendResponsePacket(socket, PACKET_TYPE.JOIN_ROOM_RESPONSE, {
      joinRoomResponse,
    });

    // 서버를 옮김
    serverSwitch(socket, config.server.host, Number(roomPort));
  } catch (error) {
    console.error(error);

    joinRoomResponse = {
      success: false,
      room: null,
      failCode: failCode.JOIN_ROOM_FAILED,
    };
    sendResponsePacket(socket, PACKET_TYPE.JOIN_ROOM_RESPONSE, {
      joinRoomResponse,
    });

    // 입장에 실패하면 방 리스트 업데이트
    getRoomListHandler(socket);
  }
};
