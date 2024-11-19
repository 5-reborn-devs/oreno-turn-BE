// Packet [Id : 25]
// message C2SUseCardRequest {
//     CardType cardType = 1;
//     int64 targetUserId = 2; // 타겟 없으면 0
// }

import { CARD_TYPES } from '../../constants/cardTypes.js';
import { fleaMarketUpdateNotification } from '../../utils/notification/game.notification.js';

// 카드의 대상이 개인 / 전체인걸로 일단 나누어질 것 같다
// 이 개인 중 대상이 나인 것이 있을 것 - 만기적금, 로또당첨, 힐 같은 카드들

// 일단 카드를 사용하는 핸들러가 필요하니 만들어봄
export const useCardHandler = async ({ socket, payload }) => {
  const { cardType, targetUserId } = payload;

  // 카드 타입이 플리마켓인 경우 플리마켓 노티 발동
  if (cardType === CARD_TYPES.FLEA_MARKET) {
    const otherUsers = getOtherUsersBySocekt(socket);
    const fleaMarketNotification = fleaMarketUpdateNotification(
      cardType,
      pickIndex,
    );
    otherUsers.socket.write(fleaMarketNotification);

    // 유저상태를 플리마켓 턴으로 바꾸고, 다른 유저의 상태는 모두 플리마켓 대기로 바꾼다
    // 다른 사람들에게 너 상태 바뀌었어를 알려줘야 하니 유저상태 업데이트 노티도 가야한다
    // 카드사용 노티도 전체에게 가야한다 - ㅇㅇ 유저가 플리마켓 사용했다! 라고 알림이 가기 때문
    // 카드가 너무 난해하다면 만기복권부터 시작하면 난이도 순으로 맞을 것이다. 
    
  }


};

// message S2CUseCardResponse { // 성공 여부만 반환하고 대상 유저 효과는 S2CUserUpdateNotification로 통지
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }

// message S2CUseCardNotification {
//     CardType cardType = 1;
//     int64 userId = 2;
//     int64 targetUserId = 3; // 타겟 없으면 0
// }
