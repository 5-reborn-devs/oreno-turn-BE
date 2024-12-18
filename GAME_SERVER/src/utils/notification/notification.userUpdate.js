import { PACKET_TYPE } from '../../constants/header.js';
import { clients } from '../../session/session.js';
import { sendResponsePacket } from '../response/createResponse.js';

export const userUpdateMultiCast = (users) => {
  users.forEach((user) => {
    const character = user.character;
    character.activeData(); // 자신만 모든 정보를 공개
    character.debuffs = character.buffStack.getBuffTypeList();

    const userUpdateNotification = {
      user: users,
    };

    const client = clients.get(user.id);

    sendResponsePacket(client, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
      userUpdateNotification,
    });

    character.hideData(); // 정보를 다시 가림.
  });
};
