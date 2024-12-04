import { PACKET_TYPE } from '../../constants/header.js';
import { users } from '../../session/session.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';

// {
//     repeated CardData destroyCards = 1
// }

export const destroyCardsHandler = async (socket, payload) => {
  const { destroyCards } = payload;

  // 카드 타입만 추출 
  const cardTypes = destroyCards.map(card => card.type); 
  console.log("카드제거 들어왔나요? :", ...cardTypes);


  try {
    const user = users.get(socket.token);
    const character = user.character;

    console.log("제거 전 손패 : ",character.cards.getHands());

    // 패에서 없애려는 카드를 삭제. 동일한 키를 삭제

      character.cards.removeHands(...cardTypes);

    const handCards = character.cards.getHands();

    character.handCards = handCards; // user 데이터 업데이트
    const destroyCardResponse = {
      handCards: handCards,
    };

    console.log("제거 후 손패 : ",character.cards.getHands());

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