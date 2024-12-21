import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users, clients } from '../../session/session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { releaseRoomId } from '../../session/room.session.js';
import { redisManager } from '../../classes/managers/redis.manager.js';
import { serverSwitch } from '../../utils/notification/notification.serverSwitch.js';
import { config } from '../../config/config.js';

export const leaveRoomHandler = async (socket, payloadData) => {
  const failCode = getFailCode();
  const roomId = socket.roomId;
  let leaveRoomResponse;
  let success = false;

  try {
    console.log('testtest');
    const room = await redisManager.rooms.getRoom(roomId);
    if (!room) {
      throw new Error('해당 방이 존재하지 않습니다');
    }

    const user = await redisManager.users.get(socket.token);
    if (await redisManager.rooms.getUser(roomId, user)) {
      // 레디스 방 데이터 삭제
      await redisManager.rooms.removeUser(roomId, user);
      await redisManager.users.delRoomId(socket.token, roomId);
    } else {
      console.error('해당 방에 유저가 존재하지 않습니다');
    }

    const usersInRoom = await redisManager.rooms.getUsers(roomId);
    const leaveRoomNotification = {
      userId: user.id,
    };

    success = true;
    leaveRoomResponse = {
      success,
      failCode: failCode.NONE_FAILCODE,
    };

    // 남은 유저가 없다면 방 삭제
    if (!usersInRoom.length) {
      await redisManager.rooms.delete(roomId);
      releaseRoomId(roomId);
    } else {
      // 나간 유저가 방장일 경우 방이 폭파됨.
      if (user.id == room.ownerId) {
        await multiCast(usersInRoom, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
          leaveRoomResponse,
        });
        await redisManager.rooms.delete(roomId);
        releaseRoomId(roomId);
      }

      // 남은 유저가 있다면 유저들에게 떠남을 알림.
      await multiCast(usersInRoom, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
        leaveRoomNotification,
      });
    }
    console.log('들어오긴하나');
  } catch (error) {
    leaveRoomResponse = {
      success,
      failCode: failCode.LEAVE_ROOM_FAILED,
    };

    console.error('방을 떠나는데 실패했습니다.', error);
  }
  // console.log('[leaveHandler]socket:\n', socket);
  await sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomResponse,
  });
  console.log('응답전송', leaveRoomResponse);

  // 현재 위치가 로비서버가 아니라면 로비로 돌아감. ? 필요한가?
  setTimeout(async () => {
    if (success) {
      users.get(socket.token).isEndIgnore = true;
      serverSwitch(socket, '127.0.0.1', 6666);
    }
  }, 100);
};
