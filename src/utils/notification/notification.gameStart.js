import { PACKET_TYPE } from '../../constants/header.js';
import { clients } from '../../session/session.js';
import { sendResponsePacket } from '../response/createResponse.js';

export const gameStartMultiCast = ({
  gameState,
  users,
  characterPositions,
}) => {
  users.forEach((user) => {
    const character = user.character;
    character.cards.reroll(); // 카드 패 리롤
    character.activeData(); // 자신만 모든 정보를 공개

    const gameStartNotification = {
      gameState,
      users,
      characterPositions,
    };

    const client = clients.get(user.id);

    sendResponsePacket(client, PACKET_TYPE.GAME_START_NOTIFICATION, {
      gameStartNotification,
    });

    character.hideData();
  });
};
