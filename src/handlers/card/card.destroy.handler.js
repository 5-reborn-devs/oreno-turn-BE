import { PACKET_TYPE } from '../../constants/header.js';
import { users } from '../../session/session.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';

// {
//     repeated CardData destroyCards = 1
// }

function mappingCards(cards) {
  const map = new Map();
  cards.forEach((card) => {
    const key = `${card.type}-${card.count}`;
    map.set(key, card);
  });
  return map;
}

export const destroyCardsHandler = async ({ socket, payload }) => {
  const { destroyCards } = payload;

  try {
    const user = users.get(socket.token);
    const character = user.character;
    let handCards = [...character.handCards]; // 패 얕은 복사

    // 카드의 속성을 맵핑
    const handCardsMap = mappingCards(handCards);
    const destroyCardsMap = mappingCards(destroyCards);

    // 패에서 없애려는 카드를 삭제. 동일한 키를 삭제
    for (const key of destroyCardsMap.keys()) {
      handCardsMap.delete(key);
    }

    handCards = [...handCardsMap.values()];

    character.handCards = handCards; // user 데이터 업데이트
    const message = {
      handCards: handCards,
    };

    sendResponsePacket(socket, PACKET_TYPE.DESTROY_CARD_RESPONSE, message);
  } catch (error) {
    console.error('카드 삭제 에러 발생', error);
  }
};

// {
//     repeated CardData handCards = 1
// }
