import { INIT_DECK } from '../../constants/cardTypes.js';
import { makeCardDeck } from '../../handlers/card/index.js';
import CardManager from '../managers/card.manager.js';

class MaskedCharacter {
  constructor(character) {
    // Character 클래스 인스턴스에서 데이터를 받아옴.
    this.characterType = character.characterType;
    this.roleType = character.roleType;
    this.hp = character.hp;
    this.stateInfo = character.stateInfo;
    this.debuffs = [];
    this._weapon = null;
    this._equips = [];
    this.bbangCount = 0;
    this.handCardsCount = 0;
    this.cards = new CardManager(makeCardDeck(INIT_DECK));
  }

  getAllData() {
    const characterInfo = this;
    characterInfo.handCards = this.cards.getHands();

    return characterInfo;
  }
}

export default MaskedCharacter;
