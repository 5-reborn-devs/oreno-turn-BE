import { INIT_DECK } from '../../constants/cardTypes.js';
import { makeCardDeck } from '../../handlers/card/index.js';
import BuffManager from '../managers/buff.manage.js';
import CardManager from '../managers/card.manager.js';
import CharacterState from './character.state.class.js';

class Character {
  constructor() {
    this.characterType = 0;
    this.roleType = 0;
    this.hp = 5;
    this.stateInfo = new CharacterState();
    this.debuffs = [];
    this._weapon = null;
    this._equips = [];
    this.bbangCount = 0;
    this.handCardsCount = 0;
    this.cards = new CardManager(makeCardDeck(INIT_DECK));
    this.buffs = new BuffManager();
  }

  activeData() {
    this.handCardsCount = this.cards.handCardsCount;
    this.handCards = this.cards.getHands();
  }

  hideData() {
    try {
      delete this.handCards;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Character;
