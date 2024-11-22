import { CARD_LIMIT, CARD_TYPES, CARD_TYPES_INDEX } from '../../constants/cardTypes.js';
import { fyShuffle } from '../../utils/fisherYatesShuffle.js';
import { fleamarketNotificationHanlder } from '../fleamarket/fleamarketNotification.handler.js';
import { maturedSavingsHandler } from './cardEffects/effect.maturedSavings.handler.js';
import { laserPointerHandler } from './laserPointer.handler.js';

const handlers = {
  [CARD_TYPES.NONE]: {
    handler: async (u, t) => {}, // 사용하게될 함수명
    typeName: CARD_TYPES_INDEX[CARD_TYPES.NONE]
  },
  [CARD_TYPES.BBANG]: {
    handler: async () => {}, // 사용하게될 함수명
    typeName: CARD_TYPES_INDEX[CARD_TYPES.BBANG]
  },
  [CARD_TYPES.MATURED_SAVINGS] : {
    handler: maturedSavingsHandler,
    typeName: CARD_TYPES_INDEX[CARD_TYPES.MATURED_SAVINGS]
  },
  [CARD_TYPES.FLEA_MARKET]:{
    handler: fleamarketNotificationHanlder,
    typeName: CARD_TYPES_INDEX[CARD_TYPES.FLEA_MARKET]
  },
  [CARD_TYPES.LASER_POINTER]:{
    handler: laserPointerHandler,
    typeName: CARD_TYPES_INDEX[CARD_TYPES.LASER_POINTER]
  }
};

export const getHandlerByCardType = (cardType) => {
  if (!handlers[cardType]) {
    throw Error('카드 타입에 해당하는 핸들러가 존재하지 않습니다.');
  }
  return handlers[cardType].handler;
};

  // 게임 시작 시 준비되어야 할 카드더미 -> (카드 타입값 * 제한 매수) 한 int 배열을 섞은 것
export const makeCardDeck = () => {
  const gameDeck = []
  for(let i = 0; i <= Object.keys(CARD_TYPES).length; i++) {
      const deckCard = Object.keys(CARD_TYPES_INDEX)[i] 

      for (let j = 0; j < Object.values(CARD_LIMIT)[i]; j++) {
        gameDeck.push(parseInt(deckCard));
      }
    }
    fyShuffle(gameDeck)
    return gameDeck;
}