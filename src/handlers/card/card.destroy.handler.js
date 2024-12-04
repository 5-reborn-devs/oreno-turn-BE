import { PACKET_TYPE } from '../../constants/header.js';
import { users } from '../../session/session.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';

// {
//     repeated CardData destroyCards = 1
// }

export const destroyCardsHandler = async (socket, payload) => {
  const { destroyCards } = payload;

  try {
    const user = users.get(socket.token);
    const character = user.character;

    // 패에서 없애려는 카드를 삭제. 동일한 키를 삭제
    destroyCards.forEach((card) => {
      character.cards.removeHands(card);
    });

    handCards = [...handCardsMap.values()];

    character.handCards = handCards; // user 데이터 업데이트
    const destroyCardResponse = {
      handCards: handCards,
    };

    sendResponsePacket(socket, PACKET_TYPE.DESTROY_CARD_RESPONSE, {
      destroyCardResponse,
    });
  } catch (error) {
    console.error('카드 삭제 에러 발생', error);
  }
};

// {
//     repeated CardData handCards = 1
// }
