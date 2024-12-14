import Buff from '../classes/models/buff.class.js';
import { getCardSum } from '../utils/getCardSum.js';
import { BUFF_TYPES } from './buffTypes.js';

export const CARD_TYPES = {
  NONE: 0,
  BBANG: 1, // 20장
  BIG_BBANG: 2, // 1장
  SHIELD: 3, // 10장
  VACCINE: 4, // 6장
  CALL_119: 5, // 2장
  DEATH_MATCH: 6, // 4장
  GUERRILLA: 7, // 1장
  ABSORB: 8, // 4장
  HALLUCINATION: 9, // 4장
  FLEA_MARKET: 10, // 3장
  MATURED_SAVINGS: 11, // 2장
  WIN_LOTTERY: 12, // 1장
  SNIPER_GUN: 13, // 1장
  HAND_GUN: 14, // 2장
  DESERT_EAGLE: 15, // 3장
  AUTO_RIFLE: 16, // 2장
  LASER_POINTER: 17, // 1장
  RADAR: 18, // 1장
  AUTO_SHIELD: 19, // 2장
  STEALTH_SUIT: 20, // 2장
  CONTAINMENT_UNIT: 21, // 3장
  SATELLITE_TARGET: 22, // 1장
  BOMB: 23, // 1장
  ARMOR: 24, // 20장
  STRENGTH: 25, // 3장
  VULNERABLE: 26, // 5장
  WEAKENED: 27, // 2장
  MANA_RECOVERY: 28, // 10장
};

export const CARD_TYPES_INDEX = {
  [CARD_TYPES.NONE]: 'NONE',
  [CARD_TYPES.BBANG]: 'BBANG',
  [CARD_TYPES.BIG_BBANG]: 'BIG_BBANG',
  [CARD_TYPES.SHIELD]: 'SHIELD',
  [CARD_TYPES.VACCINE]: 'VACCINE',
  [CARD_TYPES.CALL_119]: 'CALL_119',
  [CARD_TYPES.DEATH_MATCH]: 'DEATH_MATCH',
  [CARD_TYPES.GUERRILLA]: 'GUERRILLA',
  [CARD_TYPES.ABSORB]: 'ABSORB',
  [CARD_TYPES.HALLUCINATION]: 'HALLUCINATION',
  [CARD_TYPES.FLEA_MARKET]: 'FLEA_MARKET',
  [CARD_TYPES.MATURED_SAVINGS]: 'MATURED_SAVINGS',
  [CARD_TYPES.WIN_LOTTERY]: 'WIN_LOTTERY',
  [CARD_TYPES.SNIPER_GUN]: 'SNIPER_GUN',
  [CARD_TYPES.HAND_GUN]: 'HAND_GUN',
  [CARD_TYPES.DESERT_EAGLE]: 'DESERT_EAGLE',
  [CARD_TYPES.AUTO_RIFLE]: 'AUTO_RIFLE',
  [CARD_TYPES.LASER_POINTER]: 'LASER_POINTER',
  [CARD_TYPES.RADAR]: 'RADAR',
  [CARD_TYPES.AUTO_SHIELD]: 'AUTO_SHIELD',
  [CARD_TYPES.STEALTH_SUIT]: 'STEALTH_SUIT',
  [CARD_TYPES.CONTAINMENT_UNIT]: 'CONTAINMENT_UNIT',
  [CARD_TYPES.SATELLITE_TARGET]: 'SATELLITE_TARGET',
  [CARD_TYPES.BOMB]: 'BOMB',
  [CARD_TYPES.ARMOR]: 'ARMOUR',
  [CARD_TYPES.STRENGTH]: 'STRENGTH',
  [CARD_TYPES.VULNERABLE]: 'VULNERABLE',
  [CARD_TYPES.WEAKENED]: 'WEAKENED',
  [CARD_TYPES.MANA_RECOVERY]: 'MANA_RECOVERY',
};

export const CARD_LIMIT = {
  [CARD_TYPES.NONE]: 0,
  [CARD_TYPES.BBANG]: 20,
  [CARD_TYPES.BIG_BBANG]: 1,
  [CARD_TYPES.SHIELD]: 0,
  [CARD_TYPES.VACCINE]: 6,
  [CARD_TYPES.CALL_119]: 2,
  [CARD_TYPES.DEATH_MATCH]: 4, // 현피 - 클라 설명서 카드 정보에는 한타로 되어있음
  [CARD_TYPES.GUERRILLA]: 1,
  [CARD_TYPES.ABSORB]: 4,
  [CARD_TYPES.HALLUCINATION]: 4,
  [CARD_TYPES.FLEA_MARKET]: 3,
  [CARD_TYPES.MATURED_SAVINGS]: 2,
  [CARD_TYPES.WIN_LOTTERY]: 1,
  [CARD_TYPES.SNIPER_GUN]: 1,
  [CARD_TYPES.HAND_GUN]: 2,
  [CARD_TYPES.DESERT_EAGLE]: 3,
  [CARD_TYPES.AUTO_RIFLE]: 2,
  [CARD_TYPES.LASER_POINTER]: 1,
  [CARD_TYPES.RADAR]: 1,
  [CARD_TYPES.AUTO_SHIELD]: 2,
  [CARD_TYPES.STEALTH_SUIT]: 2,
  [CARD_TYPES.CONTAINMENT_UNIT]: 3,
  [CARD_TYPES.SATELLITE_TARGET]: 1,
  [CARD_TYPES.BOMB]: 1,
  [CARD_TYPES.ARMOR]: 20,
  [CARD_TYPES.STRENGTH]: 3,
  [CARD_TYPES.VULNERABLE]: 5,
  [CARD_TYPES.WEAKENED]: 2,
  [CARD_TYPES.MANA_RECOVERY]: 10,
};

export const CARD_SUM = getCardSum(CARD_LIMIT);

export const INIT_DECK = {
  [CARD_TYPES.BBANG]: 3,
  [CARD_TYPES.VACCINE]: 2,
  [CARD_TYPES.ARMOR]: 1,
  [CARD_TYPES.STRENGTH]: 1,
  [CARD_TYPES.VULNERABLE]: 1,
  [CARD_TYPES.WEAKENED]: 1,
  [CARD_TYPES.MANA_RECOVERY]: 1,
};

export const CARD_CONFIG = {
  [CARD_TYPES.NONE]: { cost: 1, coin: 100 },
  [CARD_TYPES.BBANG]: { cost: 3, coin: 100, param: { attack: 10 } },
  [CARD_TYPES.BIG_BBANG]: { cost: 1, coin: 100 },
  [CARD_TYPES.SHIELD]: {
    cost: 1,
    coin: 100,
    param: { buffType: BUFF_TYPES.ARMOR, stack: 10 },
  },
  [CARD_TYPES.VACCINE]: { cost: 2, coin: 100, param: { heal: 10 } },
  [CARD_TYPES.CALL_119]: { cost: 1, coin: 100 },
  [CARD_TYPES.DEATH_MATCH]: { cost: 1, coin: 100 },
  [CARD_TYPES.GUERRILLA]: { cost: 1, coin: 100 },
  [CARD_TYPES.ABSORB]: { cost: 1, coin: 100 },
  [CARD_TYPES.HALLUCINATION]: { cost: 1, coin: 100 },
  [CARD_TYPES.FLEA_MARKET]: { cost: 1, coin: 100 },
  [CARD_TYPES.MATURED_SAVINGS]: { cost: 1, coin: 100 },
  [CARD_TYPES.WIN_LOTTERY]: { cost: 1, coin: 100 },
  [CARD_TYPES.SNIPER_GUN]: { cost: 1, coin: 100 },
  [CARD_TYPES.HAND_GUN]: { cost: 1, coin: 100 },
  [CARD_TYPES.DESERT_EAGLE]: { cost: 1, coin: 100 },
  [CARD_TYPES.AUTO_RIFLE]: { cost: 1, coin: 100 },
  [CARD_TYPES.LASER_POINTER]: { cost: 1, coin: 100 },
  [CARD_TYPES.RADAR]: { cost: 1, coin: 100 },
  [CARD_TYPES.AUTO_SHIELD]: { cost: 1, coin: 100 },
  [CARD_TYPES.STEALTH_SUIT]: { cost: 1, coin: 100 },
  [CARD_TYPES.CONTAINMENT_UNIT]: { cost: 1, coin: 100 },
  [CARD_TYPES.SATELLITE_TARGET]: { cost: 1, coin: 100 },
  [CARD_TYPES.BOMB]: { cost: 1, coin: 100 },
  [CARD_TYPES.ARMOR]: {
    cost: 1,
    coin: 100,
    param: { buffType: BUFF_TYPES.ARMOR, stack: 10 },
  },
  [CARD_TYPES.STRENGTH]: {
    cost: 4,
    coin: 100,
    param: { buffType: BUFF_TYPES.POWER, stack: 10 },
  },
  [CARD_TYPES.VULNERABLE]: {
    cost: 2,
    coin: 100,
    param: { buffType: BUFF_TYPES.VULNERABLE, stack: 3 },
  },
  [CARD_TYPES.WEAKENED]: {
    cost: 3,
    coin: 100,
    param: { buffType: BUFF_TYPES.WEAKENED, stack: 3 },
  },
  [CARD_TYPES.MANA_RECOVERY]: {
    cost: 0,
    coin: 100,
    param: { manaRecovery: 2 },
  },
};

export const EF = {
  attack: (type, user, targetUser) => {
    const { attack } = CARD_CONFIG[type].param;
    const userBuffs = user.character.buffStack;
    const targetBuffs = targetUser.character.buffStack;

    // 데미지 영향 버프
    const POWER = userBuffs.getBuff(BUFF_TYPES.POWER);
    const ARMOR = targetBuffs.getBuff(BUFF_TYPES.ARMOR);
    const isVulnerable = userBuffs.isBuff(BUFF_TYPES.VULNERABLE); // 내가 약화됨 - 손이 미끄러짐
    const isWeakened = targetBuffs.isBuff(BUFF_TYPES.WEAKENED);

    // 기초 데미지가 0이하라면 0 반환
    let damage = attack + POWER;
    if (damage <= 0) return true;

    // 약화 계산 뒤 소비
    if (isVulnerable) {
      damage = Math.floor(damage * 0.75);
      userBuffs.comsumeBuff(BUFF_TYPES.VULNERABLE);
    }

    // 쇠약 계산 뒤 소비
    if (isWeakened) {
      damage = Math.floor(damage * 1.5);
      targetBuffs.comsumeBuff(BUFF_TYPES.VULNERABLE);
    }

    // 최종 데미지
    const finalDamage = ARMOR - damage;

    // 쉴드로 전부 방어한 경우
    if (finalDamage > 0) {
      targetBuffs.setBuff(new Buff(BUFF_TYPES.SHIELD, finalDamage));
      return true;
    }

    // 전부 막지 못한 경우
    targetBuffs.deleteBuff(BUFF_TYPES.ARMOR);

    targetUser.character.HP += finalDamage;
    user.character.MP -= CARD_CONFIG[type].cost;
    return true;
  },
  buff: (type, user, targetUser) => {
    const { buffType, stack } = CARD_CONFIG[type].param;
    // 타겟 지정이 없으면 자신에게 사용
    if (!targetUser) {
      console.log('타겟이 지정되지 않음.', targetUser);
      targetUser = user;
    }
    targetUser.character.buffStack.addBuff(buffType, stack);
    user.character.MP -= CARD_CONFIG[type].cost;
    return true;
  },
  heal: (type, user, targetUser) => {
    const { heal } = CARD_CONFIG[type].param;
    user.character.HP += heal;
    user.character.MP -= CARD_CONFIG[type].cost;
    return true;
  },
  manaRecovery: (type, user, targetUser) => {
    const { manaRecovery } = CARD_CONFIG[type].param;
    user.character.MP += manaRecovery;
    user.character.MP -= CARD_CONFIG[type].cost;
    return true;
  },
  isMaxMp: (type, user, targetUser) => {
    return user.character.MP < 10;
  },
  isMinMp: (type, user, targetUser) => {
    const cost = CARD_CONFIG[type].cost;
    return user.character.MP >= cost;
  },
  isMaxHp: (type, user, targetUser) => {
    return user.character.HP < 50;
  },
  isEnemy: (type, user, targetUser) => {
    const isEnemy = user !== targetUser;
    // 대상이 없거나 자신이 대상이면 false
    return targetUser && isEnemy;
  },
};

export const CARD_EFFECTS = {
  [CARD_TYPES.BBANG]: [EF.isMinMp, EF.isEnemy, EF.attack],
  [CARD_TYPES.SHIELD]: [EF.isMinMp, EF.buff],
  [CARD_TYPES.VACCINE]: [EF.isMinMp, EF.isMaxHp, EF.heal],
  [CARD_TYPES.ARMOR]: [EF.isMinMp, EF.buff],
  [CARD_TYPES.STRENGTH]: [EF.isMinMp, EF.buff],
  [CARD_TYPES.VULNERABLE]: [EF.isMinMp, EF.isEnemy, EF.buff],
  [CARD_TYPES.WEAKENED]: [EF.isMinMp, EF.isEnemy, EF.buff],
  [CARD_TYPES.MANA_RECOVERY]: [EF.isMaxMp, EF.manaRecovery],
};
