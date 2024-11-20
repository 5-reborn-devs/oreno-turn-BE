import { getProtoMessages } from '../../init/loadProto.js';
import CharacterState from './charater.state.class';

const protoMessages = getProtoMessages();

class Character {
  constructor() {
    this.characterType = protoMessages.enum.CharacterType.NONE_CHARACTER;
    this.roleType = protoMessages.enum.CharacterType.NONE_CHARACTER;
    this.hp = null;
    this.weapon = null;
    this.stateInfo = new CharacterState();
    this.equips = [];
    this.debuffs = [];
    this.handCards = [];
    this.bbangCount = 0;
    this.handCardsCount = 0;
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
