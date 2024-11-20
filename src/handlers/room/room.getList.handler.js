import { PACKET_TYPE } from '../../constants/header.js';
import { rooms } from '../../session/session.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';

// {
//     int32 id = 1,
//     string ownerId = 2,
//     string name = 3,
//     int32 maxUserNum = 4,
//     roomStateType state = 5
//  }

export const getRoomListHandler = async (socket, payloadData) => {
  try {
    const message = {
      rooms: [...rooms.values()],
    };

    sendResponsePacket(socket, PACKET_TYPE.GET_ROOM_LIST_RESPONSE, message);
  } catch (error) {
    console.error('방 리스트 가져오기 실패', error);
  }
};

// {
//     repeated RoomData rooms = 1
//  }
