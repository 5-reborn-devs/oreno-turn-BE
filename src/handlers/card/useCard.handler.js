// {
//     CardType cardType = 1,
//     string targetUserId = 2
// }

import { GLOBAL_FAIL_CODES } from '../../constants/globalFailCodes.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getAllUsersInRoom, getUserRoom } from '../../session/room.session.js';
import {
  getOtherUsersById,
  getUserById,
  getUserBySocket,
} from '../../session/user.session.js';
import { parseUserData } from '../../utils/notification/userDatas.js';
import sendResponsePacket, {
  multiCast,
} from '../../utils/response/createResponse.js';
import { getHandlerByCardType, makeCardDeck } from './index.js';

export const useCardHandler = async (socket, payload) => {
  const { cardType, targetUserId } = payload;

  const user = getUserBySocket(socket);
  const userCharacter = user.character;
  const userRoomId = socket.roomId;

  const userRoom = getUserRoom(userRoomId);
  const gameDeck = userRoom.gameDeck;

  // 페이로드 값 검증
  if (!cardType) {
    console.error('카드 타입 값이 없습니다.');
  }
  if (!targetUserId) {
    console.error('유효하지 않은 대상입니다.');
  }
  // 손에 있는 카드인지 검증
  if (!userCharacter.handCards.some((card) => card.cardType === cardType)) {
    console.error('소유하고 있는 카드가 아닙니다.');
  }

  try {
    // 핸들러 돌려준다 - 여기서 너무 길어지면 안되므로 동혁님이 card.js로 핸들러 맵핑을 따로 뺀것
    const handler = getHandlerByCardType(cardType);
    await handler(socket, gameDeck, cardType, targetUserId);

    // 사용한 카드를 타입으로 찾아 손패에서 지워줌
    let usedCardCount = userCharacter.handCards.get(cardType);
    handCards.set(cardType, --usedCardCount);

    // 나에게 카드 사용 리스폰스
    sendResponsePacket(socket, PACKET_TYPE.USE_CARD_RESPONSE, {
      success: true,
      failcode: 0,
    });

    // 방 생성할때 소켓에 넣어준 id 가져옴
    const roomId = socket.roomId;
    if (!roomId) return;

    const allUsersInRoom = getAllUsersInRoom(roomId);

    // 전체 유저에게 카드 사용 노티
    multiCast(allUsersInRoom, PACKET_TYPE.USE_CARD_NOTIFICATION, {
      cardType: cardType,
      userId: user.id,
      targetUserId: targetUserId,
    });

    // 유저 업데이트에 반영할 나의 데이터 (user는 위에서 찾아놨음)
    const userData = parseUserData(user.id, user);

    // 유저 업데이트에 반영할 타겟 유저와 데이터
    const targetedUser = getUserById(targetUserId);
    let targetedUserData = parseUserData(targetUserId, targetedUser);

    // 난사나 플리마켓처럼 대상 여러명인 경우 targetUserId가 0이라 if문에 걸릴 것
    // 다른 유저들의 id를 잡아와서 하나하나 타겟으로 parseData함수 쓰고 배열에 푸쉬, 그 배열을 전달
    if (targetUserId === 0) {
      targetedUserData = [];
      const otherUsers = getOtherUsersById(user.id);
      otherUsers.forEach((user) => {
        const parsedDatas = parseUserData(user.id, user);
        targetedUserData.push(parsedDatas);
      });
    }

    // 유저 업데이트 노티
    multiCast(allUsersInRoom, PACKET_TYPE.USER_UPDATE_NOTIFICATION, [
      userData,
      targetedUserData,
    ]);
  } catch (e) {
    console.error(`카드 사용 중 에러 발생: ${e.message}`);
    sendResponsePacket(socket, PACKET_TYPE.USE_CARD_RESPONSE, {
      success: false,
      failcode: GLOBAL_FAIL_CODES.CARD_USE_ERROR,
    });
  }
};

// {
//     bool success = 1,
//     GlobalFailCode failCode = 2
// }

// 카드 사용 성공 시에만 반환.
// 대상 유저 효과는 유저 정보 업데이트로 통지

// {
//     CardType cardType = 1,
//     string userId = 2,
//     string targetUserId = 3
// }
