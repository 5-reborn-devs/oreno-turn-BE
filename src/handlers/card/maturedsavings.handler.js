import { getUserById } from '../../session/user.session.js';
import { makeCardDeck } from './card.js';

// 만기적금 - 은행 npc에게 사용시 핸드카드 두장을 획득한다
export const maturedsavingsHandler = async (socket, cardType, targetUserId) => {
  const user = getUserById(targetUserId);
  const userCharacter = user.character;

  // 카드더미에서 2장 뽑아 유저에게 준다
  // 카드더미에서 2장 줄이고, 종류값에 맞는 카드를 유저 핸드로 넣어준다
  // handCard는 type, count로 이루어져 있으니 Map이나 2차원배열로 들어가야 한다 -> Map이 좋을 것 같다 🤔

  // CardData {
  //     CardType type = 1;
  //     int32 count = 2;
  // }

  // CharacterData {
  //     CharacterType characterType = 1;
  //     RoleType roleType = 2;
  //     int32 hp = 3;
  //     int32 weapon = 4;
  //     CharacterStateInfoData stateInfo = 5;
  //     repeated int32 equips = 6;
  //     repeated int32 debuffs = 7;
  //     repeated CardData handCards = 8;
  //     int32 bbangCount = 9;
  //     int32 handCardsCount = 10;
  // }

  const cardDeck = makeCardDeck();
  const pickedCards = cardDeck.splice(0, 2)[0];
  const handCards = userCharacter.handCards;

  // 얻은 카드의 타입과 장수를 handCards에 set으로 넣어준다
  pickedCards.forEach((pickedCard) => {
    let count = handCards.get(pickedCard.cardType);
    handCards.set(pickedCard.cardType, ++count);
  });
};
