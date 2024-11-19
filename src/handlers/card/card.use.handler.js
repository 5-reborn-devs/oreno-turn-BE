import { CARD_TYPES } from '../../constants/cardTypes.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getUsersWithoutMe } from '../../session/room.session.js';
import { users } from '../../session/session.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { getHandlerByCardType } from './card.js';

// {
//     CardType cardType = 1,
//     string targetUserId = 2
// }

export const useCardHandler = async ({ socket, payload }) => {
  const { cardType, targetUserId } = payload;
  const failCode = getFailCode();
  const message = {
    suceess: false,
    failCode: failCode.UNKNOWN_ERROR,
  };

  try {
    const user = users.get(socket.token);
    const character = user.character;

    // 존재하는 카드 종류인지 검증
    if (!Object.hasOwn(CARD_TYPES, cardType)) {
      // 존재하지 않는 카드 종류 요청에 따른 failCode는 없음.
      throw new Error('존재하지 않는 카드 종류');
    }

    // 캐릭터가 소지한 카드인지 검증
    if (!character.handCards.some((card) => card.type == cardType)) {
      message.failCode = failCode.CHARACTER_NO_CARD;
      // throw error로 빠져나갔을 때 failcode 업데이트한게 살아있을지 모르겠음.
      throw new Error('소지 않은 카드 사용');
    }

    const handler = getHandlerByCardType(cardType);
    await handler(user, targetUserId);
    message.suceess = true;
    message.failCode = failCode.NONE_FAILCODE;

    const notification = {
      cardType: cardType,
      userId: user.id,
      suceess: true,
    };
    const usersInRoomWithoutMe = getUsersWithoutMe(socket.roomId, user.id);
    multiCast(
      usersInRoomWithoutMe,
      PACKET_TYPE.CARD_EFFECT_NOTIFICATION,
      notification,
    );
  } catch (errer) {
    console.error('카드 사용중 알 수 없는 에러');
  }

  sendResponsePacket(socket, PACKET_TYPE.USE_CARD_RESPONSE, message);
};

// { 응답
//     bool success = 1,
//     GlobalFailCode failCode = 2
// }

// { 알림
//     CardType cardType = 1,
//     string userId = 2,
//     string targetUserId = 3
// }
