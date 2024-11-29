// {
//     CardType cardType = 1,
//     string targetUserId = 2
// }

import { GLOBAL_FAIL_CODES } from '../../constants/globalFailCodes.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getUsersInRoom, getUserRoom } from '../../session/room.session.js';
import { getUserById, getUserBySocket } from '../../session/user.session.js';
import { parseMyData } from '../../utils/notification/myUserData.js';
import { parseUserDatas } from '../../utils/notification/userDatas.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { getHandlerByCardType } from './index.js';
import { clients } from '../../session/session.js';

export const useCardHandler = async (socket, payload) => {
  const { cardType, targetUserId } = payload;

  // 유저아이디가 Long으로 보내지고 받을 때도 그렇다. Js는 Long타입이 없어 변환해줘야한다.
  const targetUserIdNumber = targetUserId.toNumber();

  const user = getUserBySocket(socket);
  const character = user.character;

  const userRoomId = socket.roomId;
  const failCode = getFailCode();

  let message;
  const userRoom = getUserRoom(userRoomId);
  // const gameDeck = userRoom.gameDeck;

  try {
    // 페이로드 값 검증
    if (!cardType) {
      message = '카드 타입 값이 없습니다.';
      console.error(message);
      throw new Error(message);
    }
    if (!targetUserId) {
      message = '타겟 유저가 없습니다.';
      console.error(message);
      throw new Error(message);
    }
    // 손에 있는 카드인지 검증
    if (!character.handCards.has(cardType)) {
      message = '소지한 카드가 아닙니다.';
      console.error(message);
      throw new Error(message);
    }

    const handler = getHandlerByCardType(cardType);
    await handler(user, targetUserIdNumber);

    // 사용한 카드를 타입으로 찾아 손패에서 지워줌
    let handCardCount = character.handCards.get(cardType);
    character.handCards.set(cardType, --handCardCount);

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

    const allUsersInRoom = getUsersInRoom(roomId);

    // 전체 유저에게 카드 사용 노티
    multiCast(allUsersInRoom, PACKET_TYPE.USE_CARD_NOTIFICATION, {
      useCardNotification: {
        cardType: cardType,
        userId: user.id,
        targetUserId: targetUserIdNumber,
      },
    });

    // 카드 사용자와 타겟유저의 상태만 업데이트 노티
    const targetUser = getUserById(targetUserIdNumber);
    const updatedUsers = [user, targetUser];

    updatedUsers.forEach((updatedUser) => {
      const otherUsers = [
        updatedUsers.find((otherUser) => otherUser.id !== updatedUser.id),
      ];

      const socketById = clients.get(updatedUser.id);
      const userData = [
        parseMyData(updatedUser),
        ...parseUserDatas(otherUsers),
      ];

      sendResponsePacket(socketById, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
        userUpdateNotification: {
          user: userData,
        },
      });
    });

    // 유저 업데이트 노티

    // multiCast(allUsersInRoom, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
    //   userUpdateNotification: { user: allUsersInRoom },
    // });
  } catch (e) {
    console.error('카드 사용 중 에러 발생', e);
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
