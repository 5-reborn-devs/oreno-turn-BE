import { BUFF_TYPES } from '../../constants/buffTypes.js';
import Buff from '../models/buff.class.js';

class BuffManager {
  constructor() {
    this.buff = new Map();
  }

  // 버프 존재 확인
  isBuff(buffType) {
    return this.buff.has(buffType);
  }

  // 버프 추가
  addBuff(buffType, stack = 1) {
    this.buff.has(buffType)
      ? (this.buff.get(buffType).count += stack)
      : this.buff.set(buffType, new Buff(buffType, stack));
  }

  // 버프 소모
  comsumeBuff(buffType) {
    if (this.buff.has(buffType)) this.buff.get(buffType).count--;
  }

  // 버프 셋
  setBuff(buff) {
    // 버프 클래스 인스턴스를 받음.
    this.buff.set(buff.type, buff);
  }

  // 버프 검색
  getBuff(buffType) {
    if (!this.buff.has(buffType)) {
      return 0;
    }
    return this.buff.get(buffType).count;
  }

  // 버프 값을 리스트로 내보냄.
  getBuffList() {
    return [...this.buff.values()];
  }

  getBuffTypeList() {
    return [...this.buff.values()].map((buff) => buff.type);
  }

  deleteBuff(buffType) {
    this.buff.delete(buffType);
  }

  // 버프 클리어
  clearBuff() {
    this.buff.clear();
  }
}

export default BuffManager;
