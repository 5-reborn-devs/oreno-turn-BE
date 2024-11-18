import { bufferManager } from '../../classes/managers/buffer.manager';
import { PACKET_TYPE } from '../../constants/header';

// {
//     repeated RoomData rooms = 1
//  }

export const joinRoomHandler = ({ socket, payload }) => {
  const failCode = bufferManager.failCode;
  let message;
  try {
    message = {
      success: true,
      room: rooms[roomId],
      failCode: failCode.NONE_FAILCODE,
    };
  } catch (error) {
    message = {
      success: false,
      room: null,
      failCode: failCode.JOIN_ROOM_FAILED,
    };

    console.error(error);
  }

  socket.write(bufferManager.encoder(PACKET_TYPE.JOIN_ROOM_RESPONSE, message));
  // S2CJoinRoomNotification
};

// {
//     bool success = 1,
//     RoomData room = 2,
//     GlobalFailCode failCode = 3
// }
