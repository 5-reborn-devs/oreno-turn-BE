import Card from '../../classes/models/card.class.js';

//마켓 오픈 공지 및 새 카드 추가
export const marketOpen = async (room) => { 

    try{
    //마켓 오픈
    room.isMarketOpen = true;
  
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