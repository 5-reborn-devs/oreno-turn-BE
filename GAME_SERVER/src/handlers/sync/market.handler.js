import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';

//마켓 입장 핸들러
export const marketEnterHandler = async (socket, payloadData) => {
  let RestockedPerUser = 3;

  // 소켓 유저&룸 검색
  const user = users.get(socket.token);
  const roomId = socket.roomId;
  const room = rooms.get(roomId);
  const cards = room.cards;

  // 남은 덱이 패 한도보다 적으면 덱에 버린카드 합치기
  if (cards.deck.length < RestockedPerUser) {
    cards.discard2Deck(); // 버린 카드 합치기.
    cards.deck = fyShuffle(cards.deck);
  }

  //마켓 리스트 추가
  for (let i = 0; i < RestockedPerUser; i++) {
    const cardType = cards.deck.pop();
    cards.discard.push(cardType);
    user.character.eveningList.push(cardType);
  }
  user.character.eveningList.push(4); //힐 버튼 대용 카드
  user.character.eveningList.push(5); //제거 버튼 대용 카드
  user.character.eveningList.push(0); //나가기 버튼 대용 카드
  // user.character.eveningList.push(...[4,5,0]);

  //노티 만들기
  const fleaMarketNotification = {
    cardTypes: user.character.eveningList,
  };

  //리스폰스 슛
  sendResponsePacket(socket, PACKET_TYPE.FLEAMARKET_NOTIFICATION, {
    fleaMarketNotification,
  });
};

// 마켓 선택 핸들러
export const marketPickHandler = (socket, payloadData) => {
  //현재 배열 모습 : [ cardType, cardType, cardType, Heal, Erase, Exit ]
  const { pickIndex } = payloadData;
  console.log('선택한 인덱스 : ', pickIndex); // 0,1,2..

  // 소켓 유저&룸 검색
  const user = users.get(socket.token);
  const roomId = socket.roomId;
  const room = rooms.get(roomId);

  // 힐,제거,나가기 선택 처리
  if (pickIndex === 3) {
    user.character.hp += 2;
    //user.character.gold - 100;
    console.log('플레이어 체력회복! 현재 체력: ', user.character.hp);
  }
  if (pickIndex === 4) {
    marketCardDelete(socket);
    //user.character.gold - 100;
    console.log('카드 제거 함수 호출');
  }
  if (pickIndex === 5) {
    console.log('나가기.');
  }

  //임시 변경 - 페이즈 오브 이벤트 이슈
  let RestockedPerUser = 3;
  if (room.phaseType !== 2) {
    RestockedPerUser = 2;
  }

  for (let i = 0; i < RestockedPerUser; i++) {
    //일치하는 카드타입 패에 추가
    if (i === pickIndex) {
      if (room.phaseType !== 2) {
        console.log('오브 카드 획득!');
        user.character.cards.deck.push(user.character.eventList[i]);
      } else {
        user.character.cards.addHands(user.character.eveningList[i]);
      }
      continue;
    }
    //나머지 공용덱으로
    if (room.phaseType !== 2) {
      console.log('오브 카드 반환!');
      room.cards.deck.push(user.character.eventList[i]);
    } else {
      room.cards.deck.push(user.character.eveningList[i]);
    }
  }
  // console.log('추가후 핸드패 :', user.character.cards.getHands());
  // console.log('추가후 캐릭터 덱 :', user.character.cards.deck);
  // console.log('추가후 덱 :', room.cards.deck);

  //리스폰스 슛
  sendResponsePacket(socket, PACKET_TYPE.FLEAMARKET_PICK_RESPONSE, {
    fleamarketPickResponse: {
      success: true,
      failCode: getFailCode(),
    },
  });

  //유저의 드로우 목록 초기화.
  user.character.eveningList = [];
  console.log('초기화 했냐?: ', user.character.eveningList);

  //드로우 여부 스위치
  if (user.character.isEveningDraw == false && room.phaseType == 2) {
    marketEnterHandler(socket, payloadData);
    user.character.isEveningDraw = true;
  }
};

// message S2CReactionResponse {
//   bool success = 1;
//   GlobalFailCode failCode = 2;
// }

//마켓 카드 제거 선택지 오픈 핸들러
export const marketCardDelete = (socket) => {
  const failCode = getFailCode();

  // 소켓 유저&룸 검색
  const user = users.get(socket.token);

  // 우선 노티 만들어.
  const reactionResponse = {
    success: true,
    failCode: failCode.NONE_FAILCODE,
  };

  sendResponsePacket(socket, PACKET_TYPE.REACTION_RESPONSE, {
    reactionResponse,
  });

  // //노티 만들기
  // const MarketCardDeleteNotification = {
  //   cardTypes: user.character.cards.getHands(), //getHands로 바꾸자.
  // };

  // //리스폰스 슛
  // sendResponsePacket(socket, PACKET_TYPE.MARKET_CARD_DELETE_NOTIFICATION, {
  //   MarketCardDeleteNotification,
  // });
};

//마켓 카드 제거 선택 핸들러
export const marketCardDeletePickHandler = (socket, payloadData) => {
  const { destroyCards } = payloadData;

  // console.log('카드제거 들어왔나요? :', destroyCards);
  // 소켓 유저&룸 검색
  const user = users.get(socket.token);

  //패(덱)에 있는 카드중에 카드타입이 일치하는 카드 1장 제거
  //user.character.cards.removeHands(cardType);

  handCards = user.character.cards.getHands();

  //노티 만들기
  const DestroyCardResponse = {
    handCards: handCards,
  };

  //리스폰스 슛
  sendResponsePacket(socket, PACKET_TYPE.DESTROY_CARD_RESPONSE, {
    DestroyCardResponse,
  });
};
/*

message C2SDestroyCardRequest {
    repeated CardData destroyCards = 1;
}

message S2CDestroyCardResponse {
    repeated CardData handCards = 1;
}

*/

/*
message S2CFleaMarketNotification {
    repeated CardType cardTypes = 1;
    repeated int32 pickIndex = 2;
}

message C2SFleaMarketPickRequest {
    int32 pickIndex = 1;
}

message S2CFleaMarketPickResponse {
    bool success = 1;
    GlobalFailCode failCode = 2;
}

message S2CMarketCardDeleteNotification {
    repeated CardType cardTypes = 1;
}

message C2SMarketCardDeleteRequest {
    CardType cardType = 1;
}

message C2SMarketCardDeleteResponse {
    bool success = 1;
    GlobalFailCode failCode = 2;
}
*/
