import { _ } from 'lodash';
import { getEmptyRooms } from '../../session/room.session';

//{}

export const joinRandomRoomHandler = ({ socket, payload }) => {
  const failCode = bufferManager.failCode;
  let message;

  // 룸 리스트를 들고옴.
  // 리스트에서 빈방을 골라냄.
  const emptyRooms = getEmptyRooms();

  // 빈방 리스트에서 랜덤하게 골라냄.
  const selectedRoom = _.sample(emptyRooms);

  // room 유효검사

  try {
    message = {
      success: true,
      room: selectedRoom,
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
//      RoomData room = 2,
//      GlobalFailCode failCode = 3
//  }

// {
//     UserData joinUser = 1
//  }
