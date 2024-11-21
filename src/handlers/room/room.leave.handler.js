import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';

// {}
export const leaveRoomHandler = async (socket, payloadData) => {
  const failCode = getFailCode();
  let leaveRoomResponse;

  try {
    const room = rooms.get(socket.roomId);
    if (!room) {
      throw new Error('해당 방이 존재하지 않습니다');
    }

    const user = users.get(socket.token);
    console.log('user data:', JSON.stringify(user));
    if (room.removeUserById(user.id)) {
      leaveRoomResponse = {
        success: true,
        failCode: failCode.NONE_FAILCODE,
      };
    } else {
      throw new Error('해당 방에 유저가 존재하지 않습니다');
    }

    room.removeUserById(user.id); // room에서 user 제거
    socket.roomId = null;
    const usersInRoom = [...room.users];
    const leaveRoomNotification = {
      userId: user.id,
    };

    // 유저들에게 떠남을 알림.
    multiCast(usersInRoom, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
      leaveRoomNotification,
    });
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

// {
//     bool success = 1,
//     GlobalFailCode failCode = 2
// }
// message S2CLeaveRoomNotification {
//   string userId = 1;
// }
