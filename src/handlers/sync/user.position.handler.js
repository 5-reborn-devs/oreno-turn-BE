import User from '../../classes/models/user.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { rooms, users } from '../../session/session.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

//유저의 위치 통기화
export const positionUpdateHandler = async (socket, payload) => {

  const { x, y } = payload;
  const failCode = getFailCode();
  const PositionUpdateResponse = {
    success: false,
    failCode: failCode.UNKNOWN_ERROR,
  };

  try {
    const user = users.get(socket.token);
    const roomId = socket.roomId;
    const room = rooms.get(roomId);
    const characterPositions = []; 
    

    //테스트 구간 
    user.character.x = x;
    user.character.y = y; 
    
    console.log("들어오는지, 일치하는지 확인해볼까? :",user.character.x,user.character.y);
    // 각각 들어온 x,y값 저장 확인 완료. 이제 리퀘가 올떄마다 갱신될거임.


    // 스위치가 이제 켜질때만 한번에 모아서 싹 보내버리자.
    //

    if(room.positionUpdateSwitch === true){

    room.users.forEach((user)=>{
      characterPositions.push({id:user.id, x:user.character.x,y:user.character.y});
    })

    console.log(characterPositions);//아마 못읽을듯


    const usersInRoom = getUsersInRoom(socket.roomId, user.id);
    const positionUpdateNotification = {
      characterPositions,
      // characterPositions: [
      //   {
      //     id: user.id,
      //     x,
      //     y,
      //   },
      // ],
    };// 노티 만들기

    console.log(" 보낸다. 어떻게 생겨먹었나 좀 보자: ",positionUpdateNotification);

   // if(room.positionUpdateSwitch === true){
   // :: 여기에 멀티 캐스트 노티.
   // room.positionUpdateSwitch = false; // 멀티 캐스트 후에 스위치를 끈다.
   //}스위치가 켜져있을때만 노티를 쏴준다.

    multiCast(usersInRoom, PACKET_TYPE.POSITION_UPDATE_NOTIFICATION, {
      positionUpdateNotification,
    });
    
    room.positionUpdateSwitch == false;

  }

  } catch (error) {
    //console.log('위치 동기화 알수없는 에러', error);
  }
  //리스폰스 보내기
  //sendResponsePacket(socket,PACKET_TYPE.POSITION_UPDATE_RESPONSE,{PositionUpdateResponse,})
};

// message CharacterPositionData {
//     int64 id = 1;
//     double x = 2;
//     double y = 3;
// }

// message C2SPositionUpdateRequest {
//     double x = 1;
//     double y = 2;
// } //23

// message S2CPositionUpdateResponse {
//     bool success = 1;
//     GlobalFailCode failCode = 2;
// }

// 방에 있는 모두에게
// message S2CPositionUpdateNotification {
//     repeated CharacterPositionData characterPositions = 1;
// }//24