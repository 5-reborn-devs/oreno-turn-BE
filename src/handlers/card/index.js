import { fyShuffle } from "../../utils/fisherYatesShuffle.js";

// 게임 시작 시 준비되어야 할 카드더미 -> (카드 타입값 * 제한 매수) 한 int 배열을 섞은 것
export const makeCardDeck = (deckInfo) => {
  const gameDeck = [];
  for (const [cardType, count] of Object.entries(deckInfo)) {
    gameDeck.push(...new Array(count).fill(Number(cardType)));
  }
  return fyShuffle(gameDeck);
};
