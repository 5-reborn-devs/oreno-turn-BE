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
  addBuff(buffType) {
    this.buff.has(buffType)
      ? this.buff.get(buffType).count++
      : this.buff.set(buffType, new Buff(buffType, 1));
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

  deleteBuff(buffType) {
    this.buff.delete(buffType);
  }

  // 버프 클리어
  clearBuff() {
    this.buff.clear();
  }

  // 버프를 통한 공격 계산 처리
  calculateDamage(damage, targetUser) {
    const targetBuffs = targetUser.character.buffs;

    // 데미지 영향 버프
    const POWER = this.getBuff(BUFF_TYPES.POWER);
    const SHIELD = targetBuffs.getBuff(BUFF_TYPES.SHIELD);
    const isVulnerable = this.isBuff(BUFF_TYPES.VULNERABLE);
    const isWeakened = targetBuffs.isBuff(BUFF_TYPES.WEAKENED);

    // 기초 데미지가 0이하라면 0 반환
    damage = damage + POWER;
    if (damage <= 0) return 0;

    // 약화 계산 뒤 소비
    if (isVulnerable) {
      damage = Math.floor(damage * 0.75);
      this.comsumeBuff(BUFF_TYPES.VULNERABLE);
    }

    // 쇠약 계산 뒤 소비
    if (isWeakened) {
      damage = Math.floor(damage * 1.5);
      targetBuffs.comsumeBuff(BUFF_TYPES.VULNERABLE);
    }

    // 최종 데미지
    const finalDamage = SHIELD - damage;

    // 쉴드로 전부 방어한 경우
    if (finalDamage > 0) {
      targetBuffs.setBuff(new Buff(BUFF_TYPES.SHIELD, finalDamage));
      return 0;
    }

    // 전부 막지 못한 경우
    targetBuffs.deleteBuff(BUFF_TYPES.SHIELD);
    return finalDamage;
  }
}

export default BuffManager;
