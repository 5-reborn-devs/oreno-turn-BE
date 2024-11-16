import { getProtoMessages } from '../../init/loadProto';
import { rooms } from '../../session/session';

// {
//     int32 id = 1,
//     string ownerId = 2,
//     string name = 3,
//     int32 maxUserNum = 4,
//     roomStateType state = 5
//  }

export const getRoomListHandler = ({ socket, payloadData }) => {
  const message = {
    rooms: [...rooms.values()],
  };

  const protoMessages = getProtoMessages();
  const response = protoMessages.gamePacket.GamePacket;
  const packet = response.encode({ getRoomListResponse: message }).finish();
  socket.write(serializer(packet, PACKET_TYPE.GET_ROOM_LIST_RESPONSE));

  return roomData;
};

// {
//     repeated RoomData rooms = 1
//  }
