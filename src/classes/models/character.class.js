import { INIT_DECK } from '../../constants/cardTypes.js';
import { makeCardDeck } from '../../handlers/card/index.js';
import { getProtoMessages } from '../../init/loadProto.js';
import CardManager from '../managers/card.manager.js';
import CharacterState from './character.state.class.js';

class Character {
  constructor() {
    this.characterType = 0;
    this.roleType = 0;
    this.hp = 5;
    this.stateInfo = new CharacterState();
    this._weapon = null;
    this._equips = [];
    this._debuffs = [];
    this._handCards = [
      { type: 1, count: 1 },
      { type: 3, count: 1 },
    ];
    this.bbangCount = 0;
    this.handCardsCount = 0;
    this.cards = new CardManager(makeCardDeck(INIT_DECK));
  }

  addCard(cardType) {
    this.cards.addHands(cardType);
  }

  getAllData() {
    const characterInfo = this;
    characterInfo.handCards = this.cards.getHands();

    return characterInfo;
  }
}

export default Character;
