import { CARD_CONFIG } from '../../constants/cardTypes.js';

class Card {
  constructor(type, count) {
    this.type = type;
    this.count = count;
    // this.cost = CARD_CONFIG[type].cost;
    // this.coin = CARD_CONFIG[type].coin;
  }
}

export default Card;
