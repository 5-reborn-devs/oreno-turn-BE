import { bufferManager } from '../../utils/response/buffer.manager';
import { PACKET_TYPE } from '../../constants/header';
import { rooms } from '../../session/session';

// {
//     int32 roomId = 1,
//     userData userId = 2,
//     roomStateType state = 3
//  }
export const leaveRoomHandler = ({ socket, payloadData }) => {
  const failCode = bufferManager.failCode;
  const { roomId, userId, state } = payloadData;
  let message;
  try {
    const room = rooms.get(roomId);
    if (!room) {
      throw new Error('해당 방이 존재하지 않습니다');
    }
    if (room.removeUserById(userId)) {
      message = {
        success: true,
        failCode: failCode.NONE_FAILCODE,
      };
    } else {
      throw new Error('해당 방에 유저가 존재하지 않습니다');
    }
    // room 에서 user 제거
    room.removeUserById(userId);
  } catch (error) {
    message = {
      success: false,
      failCode: failCode.LEAVE_ROOM_FAILED,
    };
  }

  socket.write(bufferManager.encoder(PACKET_TYPE.LEAVE_ROOM_RESPONSE, message));
  //   S2CLeaveRoomNotification
};

// {
//     bool success = 1,
//     GlobalFailCode failCode = 2
// }
