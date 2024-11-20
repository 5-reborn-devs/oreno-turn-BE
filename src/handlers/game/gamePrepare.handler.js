import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { rooms } from '../../session/session.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const gamePrepare = (socket) => {
  const protoMessages = getProtoMessages();
  let gamePrepareResponse;
  const failCode = getFailCode();
  try {
    const roomId = socket.roomId; // socket.roomId로 통일
    const room = rooms.get(roomId); // 클라이언트가 들어가 있는 방정보를 가져옴
    const usersInRoom = [...room.users]; // 방 안에 있는 모든 유저들의 정보를 가져옴

    room.users[0].character.characterType =
      protoMessages.enum.CharacterType.values['RED'];
    room.users[1].character.characterType =
      protoMessages.enum.CharacterType.values['SHARK'];
    room.users[0].character.roleType =
      protoMessages.enum.RoleType.values['TARGET'];
    room.users[1].character.roleType =
      protoMessages.enum.RoleType.values['HITMAN'];
    console.log(room);
    console.log(room.users[0]);
    console.log(room.users[1]);
    const gamePrepareNotification = { room: room };
    const Notification = {
      gamePrepareNotification,
    };
    gamePrepareResponse = {
      success: true,
      failcode: failCode.NONE_FAILCODE,
    };

    multiCast(usersInRoom, PACKET_TYPE.GAME_PREPARE_NOTIFICATION, Notification);
  } catch (err) {
    gamePrepareResponse = {
      success: false,
      failcode: failCode.UNKNOWN_ERROR,
    };
    console.error(err);
  }
  sendResponsePacket(socket, PACKET_TYPE.GAME_PREPARE_RESPONSE, {
    gamePrepareResponse,
  });
};
