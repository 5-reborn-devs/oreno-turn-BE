import { getProtoMessages } from '../../init/loadProto';
import { rooms } from '../../session/session';
import sendResponsePacket from '../../utils/response/createResponse';

// {
//     int32 id = 1,
//     string ownerId = 2,
//     string name = 3,
//     int32 maxUserNum = 4,
//     roomStateType state = 5
//  }

export const getRoomListHandler = async ({ socket, payloadData }) => {
  const message = {
    rooms: [...rooms.values()],
  };

  sendResponsePacket(socket, PACKET_TYPE.GET_ROOM_LIST_RESPONSE, message);
};

// {
//     repeated RoomData rooms = 1
//  }
