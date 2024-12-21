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
import { getUserById } from '../../session/user.session.js';

export const leaveRoomHandler = async (socket, payloadData) => {
  // 페일코드를 들고옴
  const failCode = getFailCode();
  // 룸아이디는 소켓roomId값으로 들고옴 검증됨
  const roomId = socket.roomId;
  let leaveRoomResponse;
  let success = false;

  try {
    // 아까들고온 roomId로 레디스에서 room정보를 가져옴
    const room = await redisManager.rooms.getRoom(roomId);
    // 만약 roomId가 이상하거나 room을 못들고오면 오류
    if (!room) {
      throw new Error('해당 방이 존재하지 않습니다');
    }
    // 유저를 레디스에서 소켓 토큰으로 가져옴 검증됨
    // const user = await redisManager.users.get(socket.token);

    // user session에서 유저 정보 가져오기
    const user = users.get(socket.token);

    // 만약 룸안에 있는 유저 정보가 존재하면 레디스에서 방에서 지워주고,
    // 유저에 정보에서도 방을 지워줌
    if (await redisManager.rooms.getUser(roomId, user)) {
      // 레디스 방 데이터 삭제
      await redisManager.rooms.removeUser(roomId, user);
      // 검증됨
      await redisManager.users.delRoomId(socket.token, roomId);
    } else {
      console.error('해당 방에 유저가 존재하지 않습니다');
    }

    // 방안에 있는 유저들을 들고옴 keys를 통해서 방안에있는 유저 번호를 가져옴
    const usersInRoom = await redisManager.rooms.getUsers(roomId);
    // 이놈 나간다고 노티만듬
    const leaveRoomNotification = {
      userId: user.id,
    };

    // 유저 onEnd 무시
    user.isEndIgnore = true;

    // 트루가됨
    success = true;
    leaveRoomResponse = {
      success,
      failCode: failCode.NONE_FAILCODE,
    };

    // 남은 유저가 없다면 방 삭제
    if (!usersInRoom.length) {
      await redisManager.rooms.delete(roomId);
    } else {
      // 나간 유저가 방장일 경우 방이 폭파됨.
      if (user.id == room.ownerId) {
        usersInRoom.forEach((userId) => {
          const user = getUserById(userId);
          user.isEndIgnore = true;
        });

        await multiCast(usersInRoom, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
          leaveRoomResponse,
        });

        await redisManager.rooms.delete(roomId);
      }

      // 남은 유저가 있다면 유저들에게 떠남을 알림.
      await multiCast(usersInRoom, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
        leaveRoomNotification,
      });
    }
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

  // 현재 위치가 로비서버가 아니라면 로비로 돌아감. ? 필요한가?
  // setTimeout(async () => {
  //   if (success) {
  //     socket.isEndIgnore = true;
  //     serverSwitch(socket, '3.34.13.74', 9000);
  //   }
  // }, 1000);
  //socket.disconnect();
};
