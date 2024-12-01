// {
//     CardType cardType = 1,
//     string targetUserId = 2
// }

import { GLOBAL_FAIL_CODES } from '../../constants/globalFailCodes.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getUsersInRoom, getUserRoom } from '../../session/room.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { animationNotify } from '../../utils/notification/notify.animation.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { getHandlerByCardType, makeCardDeck } from './index.js';

export const useCardHandler = async (socket, payload) => {
  const { cardType, targetUserId } = payload;

  // 유저아이디가 Long으로 보내지고 받을 때도 그렇다. Js는 Long타입이 없어 변환해줘야한다.
  const targetUserIdNumber = targetUserId.toNumber();

  const user = getUserBySocket(socket);
  const userCharacter = user.character;
  const roomId = socket.roomId;
  const failCode = getFailCode();

  try {
    // 페이로드 값 검증
    if (!cardType) {
      throw new Error('카드 타입 값이 없습니다.');
    }
    if (!targetUserIdNumber) {
      throw new Error('유효하지 않은 대상입니다.');
    }
    // 손에 있는 카드인지 검증
    if (!userCharacter.handCards.some((card) => card.type === cardType)) {
      throw new Error('소유하고 있는 카드가 아닙니다.');
    }
    if (!roomId) throw new Error('존재하지 않는 방 호출');

    // 핸들러 돌려준다 - 여기서 너무 길어지면 안되므로 동혁님이 card.js로 핸들러 맵핑을 따로 뺀것
    const handler = getHandlerByCardType(cardType);
    await handler(user, targetUserIdNumber);

    // 나에게 카드 사용 리스폰스
    sendResponsePacket(socket, PACKET_TYPE.USE_CARD_RESPONSE, {
      useCardResponse: {
        success: true,
        failCode: failCode.NONE_FAILCODE,
      },
    });

    // 방 생성할때 소켓에 넣어준 id 가져옴
    const allUsersInRoom = getUsersInRoom(roomId);

    // 전체 유저에게 카드 사용 노티
    multiCast(allUsersInRoom, PACKET_TYPE.USE_CARD_NOTIFICATION, {
      useCardNotification: {
        cardType: cardType,
        userId: user.id,
        targetUserId: targetUserIdNumber,
      },
    });

    // 유저 업데이트 노티
    multiCast(allUsersInRoom, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
      userUpdateNotification: { user: allUsersInRoom },
    });
  } catch (e) {
    console.error('카드 사용 중 에러 발생:', e);
    sendResponsePacket(socket, PACKET_TYPE.USE_CARD_RESPONSE, {
      useCardResponse: {
        success: false,
        failCode: GLOBAL_FAIL_CODES.CARD_USE_ERROR,
      },
    });
  }
};
