import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { RANDOM_POSITIONS } from '../../constants/randomPositions.js';
import Card from '../../classes/models/card.class.js';
import { fyShuffle } from '../../utils/fisherYatesShuffle.js';
import { getUserById, getUserBySocket } from '../../session/user.session.js';

// 황혼 공통 드로우
export const eveningDraw = async(room) => {

    try{

    //개인에게 전달할 카드 장수
    const cardsPerUser = 3;
  
    //반복문을 돌며, 공용풀에서 카드를 뽑아, 뽑힌 카드 배열에 집어넣기
    room.users.forEach((user)=>{
    const targetUserId = user.id
    const cards = [];
    
      for(let i = 0; i< cardsPerUser; i++){
  
        const cardType = room.gameDeck.pop();
        if(cardType){
          const card = new Card(cardType,1);
          cards.push(card);
        }
      }
  
      //노티 만들기
      const eveningDrawResponse = {
        targetUserId,
        cards,
      }
  
      //임시 드로우 피드백
      eveningPick(room,eveningDrawResponse);
  
      // 개인에게 리스폰스
      // sendResponsePacket(room, PACKET_TYPE.EVENING_DRAW_RESPONSE, {eveningDrawResponse});
    });
    }catch(error){
      console.error('황혼 드로우중 에러', error);
    }
  
  }


  export const eveningPick = async(socket, payloadData)=>{

    //const { pickIndex, unPickedIndex } = payloadData;
     const failCode = getFailCode();
     const {cards, targetUserId } = payloadData;
    
      //임시 고른카드, 고르지 않은 카드 할당
      const pickIndex = [cards[0]];
      const unPickedIndex = [cards[1],cards[2]];
      
    
      try{
    
      // 소켓 유저&룸 검색
      // const user = users.get(socket.token);
      // const roomId = socket.roomId;
      // const room = rooms.get(roomId);
      
      //임시 유저 검색
      const user = getUserById(targetUserId);
    
      //픽한 카드 개인덱에 추가.
      pickIndex.forEach(index =>user.character.privateDeck = [...user.character.privateDeck, index]);
    
      //픽하지 않은 카드들 다시 공용덱에 넣고 셔플.
      unPickedIndex.forEach(index => socket.gameDeck = [...socket.gameDeck, index]);
      fyShuffle(socket.gameDeck);
    
      //노티 생성
      const eveningPick = {
        success: true,
        failCode: failCode.NONE_FAILCODE,
      }
    
      //결과 반환
      //sendResponsePacket(socket, PACKET_TYPE.EVENING_PICK_RESPONSE, {eveningPick});
      
      }catch(error){
        console.error('공용 카드 선택 검증 에러', error);
      }
    }

    /*
message C2SEveningPickRequest { 
    int32 pickIndex = 1;
    repeated int32 unPickedIndex = 2; 
}

message S2CEveningPickResponse { 
    bool success = 1;
    GlobalFailCode failCode = 2;
}
*/
