import CharacterState from './character.state.class.js';

class Character {
  constructor() {
    this.characterType = 0;
    this.roleType = 0;
    this.hp = 5;
    this.stateInfo = new CharacterState();
    this.weapon = null;
    this.equips = [];
    this.debuffs = [];
    this.handCards = new Map();
    this.bbangCount = 0;
    this.handCardsCount = 0;
  }

  addCard(card) {
    // 해당 타입 카드가 존재하면 handCards에서 count만 +1 시켜주고
    // 존재하지 않는다면 handCards에서 type과 count를 1로 설정하여 set
    const existCard = this.handCards.find(
      (existingCard) => existingCard.type === card.type,
    );

    if (existCard) {
      existCard.count += card.count;
    } else {
      this.handCards.push({ type: card.type, count: card.count });
    }
    this.handCardsCount += card.count;
  }
}

export default Character;
