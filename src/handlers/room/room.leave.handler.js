import { PACKET_TYPE } from '../../constants/header.js';
import { rooms } from '../../session/session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';

// {
//     int32 roomId = 1,
//     userData userId = 2,
//     roomStateType state = 3
//  }
export const leaveRoomHandler = async (socket) => {
  const { roomId, userId, state } = payloadData;
  const failCode = getFailCode();
  let leaveRoomNotification;
  console.log(payloadData);
  try {
    const room = rooms.get(roomId);
    if (!room) {
      throw new Error('해당 방이 존재하지 않습니다');
    }
    if (room.removeUserById(userId)) {
      leaveRoomNotification = {
        success: true,
        failCode: failCode.NONE_FAILCODE,
      };
    } else {
      throw new Error('해당 방에 유저가 존재하지 않습니다');
    }

    room.removeUserById(userId); // room에서 user 제거
    socket.roomId = null;
    const usersInRoom = [...room.users]; // 얕은 복사

    multiCast(usersInRoom, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, { userId }); // 유저들에게 떠남을 알림.
  } catch (error) {
    leaveRoomNotification = {
      success: false,
      failCode: failCode.LEAVE_ROOM_FAILED,
    };

    console.error('방을 떠나는데 실패했습니다.', error);
  }

  sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomNotification,
  });
};

// {
//     bool success = 1,
//     GlobalFailCode failCode = 2
// }
// message S2CLeaveRoomNotification {
//   string userId = 1;
// }
