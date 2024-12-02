import Buff from '../models/buff.class.js';

class BuffManager {
  constructor() {
    this.buff = new Map();
  }

  // 버프 추가
  addBuff(buffType) {
    this.buff.has(buffType)
      ? this.buff.get(buffType).count++
      : this.buff.set(buffType, new Buff(buffType, 1));
  }

  // 버프 소모
  comsumeBuff(buffType) {
    if (this.buff.has(buffType)) this.buff.get(buffType).count--;
  }

  // 버프 검색
  getBuff(buffType) {
    this.buff.get(buffType);
  }

  // 버프 값을 리스트로 내보냄.
  buff2List() {
    return [...this.buff.values()];
  }

  // 버프 클리어
  clearBuff() {
    this.buff.clear();
  }

  // 버프를 통한 공격 계산 처리
  calculateDamage() {}
}

export default BuffManager;
