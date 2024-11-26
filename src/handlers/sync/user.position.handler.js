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
    

    /*검증 구간 

    */

    const usersInRoom = getUsersInRoom(socket.roomId, user.id);
    const positionUpdateNotification = {
      characterPositions: [
        {
          id: user.id,
          x,
          y,
        },
      ],
    };// 노티 만들기

   // if(room.positionUpdateSwitch === true){
   // :: 여기에 멀티 캐스트 노티.
   // room.positionUpdateSwitch = false; // 멀티 캐스트 후에 스위치를 끈다.
   //}스위치가 켜져있을때만 노티를 쏴준다.

    multiCast(usersInRoom, PACKET_TYPE.POSITION_UPDATE_NOTIFICATION, {
      positionUpdateNotification,
    });

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