import { GLOBAL_FAIL_CODES } from '../../constants/globalFailCodes.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { CARD_EFFECTS } from '../../constants/cardTypes.js';
import { getUsersInRoom, getUserRoom } from '../../session/room.session.js';
import { getUserById, getUserBySocket } from '../../session/user.session.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { userUpdateMultiCast } from '../../utils/notification/notification.userUpdate.js';
import { winMultiCast } from '../../utils/notification/notification.win.js';
import { rooms } from '../../session/session.js';

export const useCardHandler = async (socket, payload) => {
  const { cardType, targetUserId } = payload;

  // 유저아이디가 Long으로 보내지고 받을 때도 그렇다. Js는 Long타입이 없어 변환해줘야한다.
  const targetUserIdNumber = targetUserId.toNumber();
  let targetUser = getUserById(targetUserIdNumber);

  const user = getUserBySocket(socket);
  const userCharacter = user.character;
  const roomId = socket.roomId;
  const failCode = getFailCode();
  const gameDeck = getUserRoom(roomId).gameDeck;

  try {
    // 페이로드 값 검증
    if (!cardType) {
      throw new Error('카드 타입 값이 없습니다.');
    }
    if (!targetUserIdNumber) {
      throw new Error('유효하지 않은 대상입니다.');
    }
    // 손에 있는 카드인지 검증
    if (!userCharacter.cards.isCardInHands(cardType)) {
      throw new Error('소유하고 있는 카드가 아닙니다.');
    }
    if (!roomId) throw new Error('존재하지 않는 방 호출');

    // 마나 부족시 발동 실패

    // 카드 사용 부분
    const effectExe = (effect, type, user, targetUser) => {
      if (!effect) return false;
      return effect(type, user, targetUser);
    };

    const effectList = [...CARD_EFFECTS[cardType]];
    // console.log(effectList);
    while (effectExe(effectList.shift(), cardType, user, targetUser)) {}

    if (effectList.length) {
      console.log(
        `[카드 사용 실패] Type: ${cardType}, Process: ${effectList.length}`,
      );
    } else {
      // 사용한 카드를 버림. (소멸카드가 생길 경우 분기 필요)
      userCharacter.cards.discardHands(cardType);

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

      // 승리 확인
      const room = rooms.get(roomId);
      winMultiCast(room);
    }
  } catch (e) {
    console.error('카드 사용 중 에러 발생:', e);
    sendResponsePacket(socket, PACKET_TYPE.USE_CARD_RESPONSE, {
      useCardResponse: {
        success: false,
        failCode: GLOBAL_FAIL_CODES.CARD_USE_ERROR,
      },
    });
  }
  // 카드 사용자와 타겟유저의 상태만 업데이트 노티
  const usersInRoom = getUsersInRoom(roomId);
  userUpdateMultiCast(usersInRoom);
};
