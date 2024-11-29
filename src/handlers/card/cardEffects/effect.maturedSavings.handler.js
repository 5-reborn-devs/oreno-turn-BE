import { getUserById } from '../../../session/user.session.js';

// 만기적금 - 은행 npc에게 사용시 핸드카드 두장을 획득한다
export const maturedSavingsHandler = async (user, gameDeck, targetUserId) => {
  const character = user.character
  const earningCount = 2;

  // 카드더미에서 2장 뽑아 유저에게 준다 - 카드더미에서 2장 줄이고, 종류값에 맞는 카드를 유저 핸드로 넣어준다
  const pickedCards = gameDeck.splice(0, earningCount);
  // 얻은 카드를 handCard에 추가하고 handCardCounts를 올리는 클래스 메서드를 호출
  pickedCards.forEach((pickedCard) => {
    character.addCardByType(pickedCard)
  });
};