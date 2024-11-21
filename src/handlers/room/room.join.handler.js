import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { getUsersWithoutMe } from '../../session/room.session.js';

// {ㅉ
//     int32 roomId = 1;
//  }

export const joinRoomHandler = async (socket, payload) => {
  const { roomId } = payload;

  const failCode = getFailCode();
  let joinRoomResponse;
  let notification;
  try {
    const room = rooms.get(roomId);
    const user = users.get(socket.token);
    room.addUser(user);
    socket.roomId = roomId;
    joinRoomResponse = {
      success: true,
      room: room,
      failCode: failCode.NONE_FAILCODE,
    };
    const joinRoomNotification = { joinUser: user };

    const usersInRoomWithoutMe = getUsersWithoutMe(roomId, user.id);
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
    sendResponsePacket(socket, PACKET_TYPE.JOIN_ROOM_RESPONSE, {
      joinRoomResponse,
    });
    console.error(error);
  }

  sendResponsePacket(socket, PACKET_TYPE.JOIN_ROOM_RESPONSE, {
    joinRoomResponse,
  });
  if (notification) multiCast(...notification);
};
// {
//     bool success = 1,
//     RoomData room = 2,
//     GlobalFailCode failCode = 3
// }
