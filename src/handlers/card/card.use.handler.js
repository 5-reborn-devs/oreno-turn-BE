import { GLOBAL_FAIL_CODES } from '../../constants/globalFailCodes.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { CARD_EFFECTS, CARD_TYPES } from '../../constants/cardTypes.js';
import { getUsersInRoom, getUserRoom } from '../../session/room.session.js';
import { getUserById, getUserBySocket } from '../../session/user.session.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { getHandlerByCardType } from './index.js';
import { userUpdateMultiCast } from '../../utils/notification/notification.userUpdate.js';
import { getUsersWithoutMe } from '../../session/room.session.js';

export const useCardHandler = async (socket, payload) => {
  const { cardType, targetUserId } = payload;

  // 유저아이디가 Long으로 보내지고 받을 때도 그렇다. Js는 Long타입이 없어 변환해줘야한다.
  const targetUserIdNumber = targetUserId.toNumber();
  let targetUser = getUserById(targetUserIdNumber);

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
    console.log(effectList);
    while (effectExe(effectList.shift(), cardType, user, targetUser)) {}

    if (effectList.length) {
      throw new Error('사용 조건 실패');
    } else {
      // const handler = getHandlerByCardType(cardType);
      // await handler(user, targetUserIdNumber);

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

      // let updatedUsers;

      // // 타겟 유저ID가 자기 자신으로 오는 경우 = 타겟 지정이 안된 경우(난사, 게릴라, 119호출[내체력 or 나머지체력 회복]) & 타겟이 자신인 경우(만기적금, 복권당첨, 백신)
      // switch (cardType) {
      //   case CARD_TYPES.MATURED_SAVINGS:
      //   case CARD_TYPES.WIN_LOTTERY:
      //     targetUser = user;
      //     updatedUsers = [user];

      //   case CARD_TYPES.BIG_BBANG:
      //   case CARD_TYPES.GUERRILLA:
      //     targetUser = getUsersWithoutMe(roomId, user.id);
      //     updatedUsers = [user, targetUser];

      //   // 어떨땐 타겟유저가 0이고 어떨땐 타겟유저가 나임 <- 이 상황의 기준을 모르겠음
      //   // 어떤 카드일때 어떤 타겟유저ID가 오는지만 정리해보고 그에 맞춰 오늘안에 와꾸 완성 예정
      //   default:
      //     targetUser = getUserById(targetUserIdNumber);
      //     updatedUsers = [user, targetUser];
      //     break;
      // }

      // 카드 사용자와 타겟유저의 상태만 업데이트 노티
      const usersInRoom = getUsersInRoom(roomId);
      userUpdateMultiCast(usersInRoom);
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
};
