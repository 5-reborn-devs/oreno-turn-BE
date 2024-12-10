import { users } from '../../session/session.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const rerollHandler = async (socket, payload) => {
  const failCode = getFailCode();
  let rerollResponse;

  try {
    const user = users.get(socket.token);
    const character = user.character;
    const usersInRoom = getUsersInRoom(socket.roomId);

    character.cards.reroll();

    character.activeData(); // 자신만 모든 정보를 공개

    const userUpdateNotification = {
      user: usersInRoom,
    };

    sendResponsePacket(socket, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
      userUpdateNotification,
    });

    character.hideData(); // 정보를 다시 가림.

    rerollResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };
  } catch (error) {
    rerollResponse = {
      success: false,
      failCode: failCode.UNKNOWN_ERROR,
    };

    console.error(error);
  }

  sendResponsePacket(socket, PACKET_TYPE.REROLL_RESPONSE, { rerollResponse });
};
