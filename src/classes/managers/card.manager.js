import { fyShuffle } from '../../utils/fisherYatesShuffle.js';
import Card from '../models/card.class.js';

class CardManager {
  constructor(deck) {
    this.hands = new Map();
    this.deck = deck;
    this.discard = [];
    this.handLimit = 5;
    this.handCardsCount = 0;
  }

  // 패 데이터 가져오기
  getHands() {
    return [...this.hands.values()];
  }

  // 패에 카드를 한장 더함.
  addHands(cardType) {
    this.hands.has(cardType)
      ? this.hands.get(cardType).count++
      : this.hands.set(cardType, new Card(cardType, 1));
    this.handCardsCount++;
  }

  // 패에 카드를 한장 제거함.
  removeHands(cardType) {
    const targetCard = this.hands.get(cardType);

    // 대상 카드가 존재하지 않는다면
    if (!targetCard || targetCard.count < 0) {
      throw new Error('targetCard Count:', targetCard);
    }
    targetCard.count--;
    this.handCardsCount--;
  }

  discardHands(cardType) {
    this.removeHands(cardType); // 패에서 카드 제거
    this.discard.push(cardType); // discard에 버림.
  }

  //남은 패 전부 버리기
  AllDiscardHands() {
    for (const [cardType, cardObj] of this.hands.entries()) {
      this.discard.concat(new Array(cardObj.count).fill(cardType));
    }

    // 패 초기화
    this.hands = new Map();
    this.handCardsCount = 0;
  }

  // 버린 카드 덱과 합치기.
  discard2Deck() {
    this.deck.push(...this.discard.splice(0, this.discard.lenth)); // 이원화 방지
  }

  // 모든 카드를 덱으로
  allCards2deck() {
    this.AllDiscardHands(); // 손패를 전부 버림.
    this.discard2Deck(); // 버린 패를 덱으로.
  }

  reRoll() {
    // 남은 덱이 패 한도보다 적으면 덱에 버린카드 합치기
    if (this.deck.length < this.handLimit) {
      this.discard2Deck(); // 버린 카드 합치기.
      this.deck = fyShuffle(this.deck);
    }

    //남은 패 전부 버리기
    this.AllDiscardHands();

    // 패 한도만큼 덱에서 뽑아서 저장
    for (let i = 0; i < this.handLimit; i++) {
      this.addHands(this.deck.pop());
    }

    this.handCardsCount = this.handLimit;
    return [...this.hands.values()];
  }

  // 황혼에서 덱을 편집할 때는 Map 구조가 유리함.
  // 데이터 이원화 문제를 해결하기 위해  황혼동안 hands에 덱을 저장함.
  getDeckMap() {
    // 카드를 전부 덱으로
    this.allCards2deck();

    // pop으로 데이터가 동시에 존재하지 않도록함.
    while (this.deck.length) {
      this.addHands(this.deck.pop());
    }

    return [...this.hands.values()];
  }
}

export default CardManager;
