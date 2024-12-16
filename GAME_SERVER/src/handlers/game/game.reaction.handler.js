import CharacterState from '../../classes/models/character.state.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { users, rooms } from '../../session/session.js';
import { getUserRoom } from '../../session/room.session.js';
import { getUserById } from '../../session/user.session.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';
import { userUpdateMultiCast } from '../../utils/notification/notification.userUpdate.js';
import { getFailCode } from '../../utils/response/failCode.js';
import Card from '../../classes/models/card.class.js';


// export const reactionHandler = async (socket) => {
//   const failCode = getFailCode();
//   let reactionResponse;

//   try {
//     // 공격당한 유저의 정보
//     const user = users.get(socket.token);
//     const character = user.character;
//     let stateInfo = character.stateInfo;

//     // 뱅을 쏜 유저의 상태를 초기화
//     const shooterId = stateInfo.stateTargetUserId;
//     const shooter = getUserById(shooterId);
//     shooter.character.stateInfo = new CharacterState();

//     // 공격당한 유저의 상태를 초기화
//     character.stateInfo = new CharacterState(); // 만약 state = new CharacterState로 초기화하면 반영안됨.
//     character.hp -= 10;

//     reactionResponse = {
//       success: true,
//       failCode: failCode.NONE_FAILCODE,
//     };

//     // 리액션 종료 후 유저 상태 동기화
//     const roomId = socket.roomId;
//     // const room = getUserRoom(roomId);
//     // const roomInUser = getUsersInRoom(roomId);
//     const room = rooms.get(roomId); // 클라이언트가 들어가 있는 방정보를 가져옴
//     console.log('룸정보 가져와', room);
//     userUpdateMultiCast(room.users);

//     // 방에 피가 1이상 남은 생존자 찾기
//     const survivers = room.users.filter((user) => user.character.hp > 0);

//     // 생존자가 1명이면 그 사람이 승리
//     if (survivers.length === 1) {
//       const winner = survivers[0];
//       room.stopCustomInterval();

//       const gameEndNotification = {
//         winners: [winner.id],
//         winType: 2, // 배틀로얄이라 사이코 밖에 없음.
//       };

//       multiCast(room.users, PACKET_TYPE.GAME_END_NOTIFICATION, {
//         gameEndNotification,
//       });
//     }
//   } catch (error) {
//     reactionResponse = {
//       success: false,
//       failCode: failCode.UNKNOWN_ERROR,
//     };

//     console.error('리액션 실패: ', error);
//   }

//   sendResponsePacket(socket, PACKET_TYPE.REACTION_RESPONSE, {
//     reactionResponse,
//   });
// };

export const reactionHandler = async (socket) => {


  const user = users.get(socket.token);
  const roomId = socket.roomId;
  const room = rooms.get(roomId);

  user.character.eventList = []; // 초기화

  console.log("유저 검색 했나요?",user);

  for(let i =0;i<2;i++){
    const cardType = room.cards.deck.pop();
    if(cardType){
      const card = new Card(cardType,1);
      user.character.eventList.push(card.type);
    }
  }

  console.log("야간 오브 리스트: ",user.character.eventList);

    //노티 만들기
    const fleaMarketNotification = {
      cardTypes: user.character.eventList,
    };

    sendResponsePacket(socket, PACKET_TYPE.FLEAMARKET_NOTIFICATION, {
      fleaMarketNotification,
    });

}