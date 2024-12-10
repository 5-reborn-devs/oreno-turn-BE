import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { releaseRoomId } from '../../session/room.session.js';
import { redisManager } from '../../classes/managers/redis.manager.js';

export const leaveRoomHandler = async (socket, payloadData) => {
  const failCode = getFailCode();
  const roomId = socket.roomId;
  const rooms = redisManager.rooms;
  let leaveRoomResponse;

  try {
    const room = await rooms.getRoom(roomId);
    if (!room) {
      throw new Error('해당 방이 존재하지 않습니다');
    }

    const user = await redisManager.users.get(socket.token);
    if (!(await rooms.getUser(roomId, user))) {
      throw new Error('해당 방에 유저가 존재하지 않습니다');
    }

    leaveRoomResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };

    rooms.removeUser(roomId, user);
    socket.roomId = null;
    const usersInRoom = await rooms.getUsers(roomId);
    const leaveRoomNotification = {
      userId: user.id,
    };

    // 남은 유저가 없다면 방 삭제
    if (!usersInRoom.length) {
      rooms.delete(roomId);
      releaseRoomId(roomId);
    } else {
      // 나간 유저가 방장일 경우 방이 폭파됨.
      if (user.id === room.ownerId) {
        multiCast(usersInRoom, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
          leaveRoomResponse,
        });
        rooms.delete(roomId);
        releaseRoomId(roomId);
      }

      // 남은 유저가 있다면 유저들에게 떠남을 알림.
      multiCast(usersInRoom, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
        leaveRoomNotification,
      });
    }
  } catch (error) {
    leaveRoomResponse = {
      success: false,
      failCode: failCode.LEAVE_ROOM_FAILED,
    };

    console.error('방을 떠나는데 실패했습니다.', error);
  }

  sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomResponse,
  });
};
