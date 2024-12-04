import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import Card from '../../classes/models/card.class.js';
import sendResponsePacket from '../../utils/response/createResponse.js';
import { clients } from '../../session/session.js';

//황혼 공통 드로우
export const eveningDrawHandler = async (room) => {
  try {
    //개인에게 전달할 카드 장수
    const cardsPerUser = 3;

    //반복 돌면서 드로우 리스트에 추가
    room.users.forEach((user) => {
      const client = clients.get(user.id);

    
      user.character.cards.getDeckMap();



      for (let i = 0; i < cardsPerUser; i++) {
        const cardType = room.cards.deck.pop();
        if (cardType) {
          const card = new Card(cardType, 1);
          user.character.eveningList.push(card.type);
        }
      }
      console.log('이브닝 드로우 리스트 : ', user.character.eveningList);
      console.log("플레이어의 손패:",user.character.cards.getHands());  

      //노티 만들기
      const eveningDistributionNotification = {
        cardType: user.character.eveningList,
      };

      //페이즈 넘어갈때 리롤 고민 필요.
      // 개인에게 리스폰스
      sendResponsePacket(client, PACKET_TYPE.EVENING_DRAW_NOTIFICATION, {
        eveningDistributionNotification,
      });
      // eveningPickHandler(client, { cardType: 1 });
    });
  } catch (error) {
    console.error('공용 카드 선택 검증 에러', error);
  }
};

//드로우 픽 핸들러
export const eveningPickHandler = async (socket, payloadData) => {
  const failCode = getFailCode();
  const { cardType } = payloadData;

  // 소켓 유저&룸 검색
  const user = users.get(socket.token);
  const roomId = socket.roomId;
  const room = rooms.get(roomId);

  try {
    // 카드 정리
    for (let i = 0; i < user.character.eveningList.length; i++) {
      //일치하는 카드타입 패에 추가
      if (user.character.eveningList[i] === cardType) {
        user.character.cards.addHands(cardType);
        continue;
      }
      //나머지 공용덱으로
      room.cards.deck.push(user.character.eveningList[i]);
    }
    //console.log("패에 카드 추가 cardType: ", cardType);

    //노티 만들기
    const eveningDrawResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };

    //리스폰스 슛
    sendResponsePacket(socket, PACKET_TYPE.EVENING_DRAW_RESPONSE, {
      eveningDrawResponse,
    });

    //유저의 드로우 목록 초기화.
    user.character.eveningList = [];
  } catch (error) {
    console.error('공용카드 드로우중 에러:', error);

    sendResponsePacket(socket, PACKET_TYPE.EVENING_DRAW_RESPONSE, {
      eveningDrawResponse: {
        success: false,
        failCode: failCode.UNKNOWN_ERROR,
      },
    });
  }
};

/*
message S2CEveningDistributionNotification {
    repeated CardType cardType = 1;
}

message C2SEveningPickRequest  {
    CardType cardType = 1;
}

message C2SEveningPickResponse  {
    bool success = 1;
    GlobalFailCode failCode = 2;
}
*/
