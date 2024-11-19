import { _ } from 'lodash';
import { getEmptyRooms } from '../../session/room.session';
import { getFailCode } from '../../utils/response/failCode';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse';
import { users } from '../../session/session';
import { PACKET_TYPE } from '../../constants/header';

//{}

export const joinRandomRoomHandler = ({ socket, payload }) => {
  const failCode = getFailCode();
  let message;

  try {
    const emptyRooms = getEmptyRooms(); // 룸 리스트에서 자리 있는 방을 골라냄.

    const selectedRoom = _.sample(emptyRooms); // 빈방 리스트에서 랜덤하게 골라냄.
    // room 유효검사

    const usersInRoom = [...selectedRoom.users]; // 입장 알림을 위해 따로 때 놓음. 얕은 복사
    const user = users.get(socket.token);
    selectedRoom.addUser(user);
    socket.roomId = selectedRoom.id;

    message = {
      success: true,
      room: selectedRoom,
      failCode: failCode.NONE_FAILCODE,
    };

    const notifiaction = { joinUser: user };
    multiCast(usersInRoom, PACKET_TYPE.JOIN_ROOM_NOTIFICATION, notifiaction); // 다른 유저에게 입장을 알림.
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
//      RoomData room = 2,
//      GlobalFailCode failCode = 3
//  }

// message S2CJoinRoomNotification {
//   UserData joinUser = 1;
// }
