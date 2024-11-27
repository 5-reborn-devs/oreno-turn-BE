import { PACKET_TYPE } from '../../constants/header.js';
import { rooms, users } from '../../session/session.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { RANDOM_POSITIONS } from '../../constants/randomPositions.js';
import Card from '../../classes/models/card.class.js';
import { fyShuffle } from '../../utils/fisherYatesShuffle.js';
import { getUserById, getUserBySocket } from '../../session/user.session.js';



//페이즈가 넘어갈때, 호출 넘어갔는지 체크.
export const phaseUpdateNotificationHandler = async (room, nextState) => {
  //페일 코드
  const failCode = getFailCode();
  const phaseUpdateNotification = {
    success: false,
    failCode: failCode.UNKNOWN_ERROR,
  };
  try {
    //const room = rooms.get(socket.roomId);

    // characterPositions
    const characterPositions = [];
    //const positionKeys = Object.keys(RANDOM_POSITIONS);
    const positionKeys = [21, 22];
    const usedPositions = new Set();
    room.users.forEach((user) => {
      let positionKey;
      do {
        //const randomIndex = Math.floor(Math.random() * positionKeys.length);
        //positionKey = positionKeys[randomIndex];
        positionKey =
          positionKeys[Math.floor(Math.random() * positionKeys.length)];
      } while (usedPositions.has(positionKey));
      usedPositions.add(positionKey);
      // console.log('x,y값', RANDOM_POSITIONS[positionKey]);
      characterPositions.push({
        id: user.id,
        x: RANDOM_POSITIONS[positionKey].x,
        y: RANDOM_POSITIONS[positionKey].y,
      });
    });

    //phaseShift : 황혼 코드 수정
    if (room.phaseType === 1) {
      console.log(`황혼으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);

      //공통 드로우 & 상점 오픈
      eveningDraw(room);
      marketOpen(room);
      
      room.phaseType = 2;

    } else if (room.phaseType === 2) {
      console.log(`밤으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);


      room.isMarketOpen = false;
      room.phaseType = 3;
    } else if (room.phaseType === 3) {
      console.log(`낮으로 전환합니다. 현재 PhaseType: ${room.phaseType}.`);
      room.isMarketOpen = false;
      room.phaseType = 1;
    } else {
      //기타 처리
    }

    //페이즈별 시간처리
    let nextPhaseAt = Date.now() + nextState;


    // 노티 만들기
    const phaseUpdateNotification = {
      phaseType: room.phaseType,
      nextPhaseAt,
      characterPositions,
    };

    // 방 전체 슛
    const usersInRoom = getUsersInRoom(room.id);
    multiCast(usersInRoom, PACKET_TYPE.PHASE_UPDATE_NOTIFICATION, {
      phaseUpdateNotification,
    });

  } catch (error) {
    console.error('페이즈 전환중 에러', error);
  }
};
/*
message S2CPhaseUpdateNotification {
    PhaseType phaseType = 1; // DAY 1, END 3 (EVENING은 필요시 추가)
    int64 nextPhaseAt = 2; // 다음 페이즈 시작 시점(밀리초 타임스탬프)
    repeated CharacterPositionData characterPositions = 3; // 변경된 캐릭터 위치
}
*/




// 황혼 공통 드로우
export const eveningDraw = async(room) => {

  try{
  //개인에게 전달할 카드 장수
  const cardsPerUser = 3;
  room.users.forEach((user)=>{
  const targetUserId = user.id
  const cards = [];

    //반복문을 돌며, 공용풀에서 카드를 뽑아, 뽑힌 카드 배열에 집어넣기
    for(let i = 0; i< cardsPerUser; i++){

      const cardType = room.gameDeck.pop();
      if(cardType){
        const card = new Card(cardType,1);
        cards.push(card);
      }
    }
    console.log("뽑힌 카드 : ", cards);
    console.log("첫번째 카드 :", cards[0]);

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

  // 로그 위치 변경해야 할 듯
  console.log("카드 선택전, 캐릭터의 소지 카드 장수: ",user.character.privateDeck.length);
  console.log("카드 선택전, 공용 덱의 소지 카드 장수: ",socket.gameDeck.length);

  //픽한 카드 개인덱에 추가.
  pickIndex.forEach(index =>user.character.privateDeck = [...user.character.privateDeck, index]);
  console.log("카드 푸쉬후, 캐릭터의 소지 카드 장수: ",user.character.privateDeck.length);


  //픽하지 않은 카드들 다시 공용덱에 넣고 셔플.
  unPickedIndex.forEach(index => socket.gameDeck = [...socket.gameDeck, index]);
  fyShuffle(socket.gameDeck);
  console.log("카드 푸쉬후, 공용 덱의 소지 카드 장수: ",socket.gameDeck.length);

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

//Remain Problem : 드로우에서나 상점에서 고르지 않은 카드들은 다시 덱으로 반환해서 섞는다.
//덱의 카드들을 전부 다썼을때, 공통 덱을 다시 생성해주는가?

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

//카드 매수 확인
//함수 분리
// 