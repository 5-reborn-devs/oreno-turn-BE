import { getUserById } from "../../session/user.session.js";
import { makeCardDeck } from "./card.js";

export const winLotteryHandler = async (user, gameDeck, targetUserId) => {
    const character = user.character
    const handCards = character.handCards;
    const earningCount = 3;

    const pickedCards = gameDeck.splice(0, earningCount);
    // 얻은 카드의 타입과 장수를 handCards에 set으로 넣어준다
    pickedCards.forEach((pickedCardType) => {
      let count = handCards.get(pickedCardType);
      count = !!count ? count : 0;
      handCards.set(pickedCardType, ++count);
    });
    
  };