// {
//     CardType cardType = 1,
//     string targetUserId = 2
// }

import { GLOBAL_FAIL_CODES } from '../../constants/globalFailCodes.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getAllUsersInRoom, getUserRoom } from '../../session/room.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { getHandlerByCardType, makeCardDeck } from './index.js';

export const useCardHandler = async (socket, payload) => {
  const { cardType, targetUserId } = payload;
  const targetUserIdNumber = targetUserId.toNumber();
  console.log('이쪽타입정보', typeof targetUserIdNumber); // 정수형이긴한데 Number
  const user = getUserBySocket(socket);
  const userCharacter = user.character;
  const userRoomId = socket.roomId;
  const failCode = getFailCode();

  let message;

  const userRoom = getUserRoom(userRoomId);
  // const gameDeck = userRoom.gameDeck;

  try {
    // 페이로드 값 검증
    if (!cardType) {
      console.error('카드 타입 값이 없습니다.');
    }
    if (!targetUserIdNumber) {
      console.error('유효하지 않은 대상입니다.');
    }
    // 손에 있는 카드인지 검증
    if (!userCharacter.handCards.some((card) => card.type === cardType)) {
      message = '소유하고 있는 카드가 아닙니다.';
      console.error(message);
      throw new Error(message);
    }

    // 핸들러 돌려준다 - 여기서 너무 길어지면 안되므로 동혁님이 card.js로 핸들러 맵핑을 따로 뺀것
    const handler = getHandlerByCardType(cardType);
    await handler(user, targetUserIdNumber);

    // 사용한 카드를 타입으로 찾아 손패에서 지워줌
    // let usedCardCount = userCharacter.handCards.get(cardType);
    // handCards.set(cardType, --usedCardCount);

    // 나에게 카드 사용 리스폰스
    sendResponsePacket(socket, PACKET_TYPE.USE_CARD_RESPONSE, {
      useCardResponse: {
        success: true,
        failCode: failCode.NONE_FAILCODE,
      },
    });

    // 방 생성할때 소켓에 넣어준 id 가져옴
    const roomId = socket.roomId;
    if (!roomId) return;

    const allUsersInRoom = getAllUsersInRoom(roomId);

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
    console.log('카드 사용 중 에러 발생:', e);
    sendResponsePacket(socket, PACKET_TYPE.USE_CARD_RESPONSE, {
      useCardResponse: {
        success: false,
        failCode: GLOBAL_FAIL_CODES.CARD_USE_ERROR,
      },
    });
  }
};

// { useCardResponse
//     bool success = 1,
//     GlobalFailCode failCode = 2
// }

// 카드 사용 성공 시에만 반환.
// 대상 유저 효과는 유저 정보 업데이트로 통지

// { useCardnoti
//     CardType cardType = 1,
//     string userId = 2,
//     string targetUserId = 3
// }

// message S2CUserUpdateNotification {
//   repeated UserData user = 1;
// }
