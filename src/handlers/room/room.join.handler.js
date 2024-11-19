import { PACKET_TYPE } from '../../constants/header';
import { myRoomId, rooms, users } from '../../session/session';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse';
import { getFailCode } from '../../utils/response/failCode';

// {
//     int32 roomId = 1;
//  }

export const joinRoomHandler = ({ socket, payload }) => {
  const { roomId } = payload;
  const failCode = getFailCode();
  let message;

  try {
    const room = rooms.get(roomId);

    const user = users.get(socket.token);
    room.addUser(user);
    myRoomId.set(socket.token, roomId);

    message = {
      success: true,
      room: room,
      failCode: failCode.NONE_FAILCODE,
    };

    const notifiaction = { joinUser: user };

    const usersInRoom = [...room.users];
    multiCast(usersInRoom, PACKET_TYPE.JOIN_ROOM_NOTIFICATION, notifiaction);
  } catch (error) {
    message = {
      success: false,
      room: null,
      failCode: failCode.JOIN_ROOM_FAILED,
    };

    console.error(error);
  }

  sendResponsePacket(socket, PACKET_TYPE.JOIN_ROOM_RESPONSE, message);
};

// {
//     bool success = 1,
//     RoomData room = 2,
//     GlobalFailCode failCode = 3
// }
