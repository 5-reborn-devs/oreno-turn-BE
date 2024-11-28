import { makeCardDeck } from '../../handlers/card/index.js';
import { getProtoMessages } from '../../init/loadProto.js';
import CharacterState from './character.state.class.js';

class Character {
  constructor() {
    const protoMessages = getProtoMessages();
    this.characterType = 0;
    this.roleType = 0;
    this.hp = 5;
    this.weapon = null;
    this.stateInfo = new CharacterState();
    this.equips = [];
    this.debuffs = [];
    this.handCards = [
      { type: 1, count: 1 },
      { type: 3, count: 1 },
    ];
    this.bbangCount = 0;
    this.handCardsCount = 0;
    this.privateDeck = makeCardDeck();
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

    console.log('카드는', this.handCards);
  }

  addEquip(itemId) {
    if (!this.equips.includes(itemId)) {
      this.equips.push(itemId);
    } else {
      console.log(`이미 ${itemId}을 장착하고 있습니다.`);
    }
  }

  removeEquip(itemId) {
    const index = this.equips.indexOf(itemId);
    if (index !== -1) {
      this.equips.splice(index, 1);
    } else {
      console.log(`장착중인 ${itemId}이 아닙니다`);
    }
  }

  addDebuff(debuffId) {
    if (!this.debuffs.includes(debuffId)) {
      this.debuffs.push(debuffId);
    } else {
      console.log(`${debuffId}디버프 추가 실패`);
    }
  }

  removeDebuff(debuffId) {
    const index = this.debuffs.indexOf(debuffId);
    if (index !== -1) {
      this.debuffs.splice(index, 1);
    } else {
      console.log(`${debuffId}디버프 제거 실패`);
    }
  }

  updateHp(amount) {
    this.hp += amount;
    if (this.hp < 0) this.hp = 0;
  }
}

export default Character;
