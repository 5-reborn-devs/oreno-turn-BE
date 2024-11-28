import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { RANDOM_POSITIONS } from '../../constants/randomPositions.js';
import Card from '../../classes/models/card.class.js';
import { fyShuffle } from '../../utils/fisherYatesShuffle.js';
import { getUserById, getUserBySocket } from '../../session/user.session.js';
import { eveningDraw, eveningPick } from './evening.phase.handler.js';

//마켓 오픈 공지 및 새 카드 추가
export const marketOpen = async (room) => { 

    try{
    //마켓 오픈
    room.isMarketOpen = true;
    console.log("해피해피해피 이마트~");
  
    // 마켓 입고 카드 매수
    const Restocked = [];
    const marketLoad = 3;
  
    //공용 카드풀에서 마켓으로 카드 입고
    for(let i=0; i<marketLoad; i++){
      const cardType = room.gameDeck.pop();
      if(cardType){
        const card = new Card(cardType,1);
        Restocked.push(card);
      }
    }
    console.log("상점 입고 카드 :", Restocked);
  
        //노티 만들기
        const marketOpenNotification = {
          Restocked,
        }
  
      // 방 전체 슛
      // const usersInRoom = getUsersInRoom(room.id);
      // multiCast(usersInRoom, PACKET_TYPE.MARKET_OPEN_NOTIFICATION, {
      //   marketOpenNotification,
      // });
    } catch(error) {
      console.error('마켓 오픈중 에러', error);
    }
  }