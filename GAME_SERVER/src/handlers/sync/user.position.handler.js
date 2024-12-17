import { PACKET_TYPE } from '../../constants/header.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { rooms, users } from '../../session/session.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';

//유저의 위치 통기화
export const positionUpdateHandler = async (socket, payload) => {
  const { x, y } = payload;

  try {
    const user = users.get(socket.token);
    const roomId = socket.roomId;
    const room = rooms.get(roomId);
    const characterPositions = [];

    // 각각 들어온 x,y값 저장 확인 완료. 이제 리퀘가 올떄마다 갱신될거임.
    user.character.isMoved = true;
    user.character.x = x;
    user.character.y = y;

    // 스위치가 켜질때만 한번에 모아서 싹 보내버리자.
    if (room.positionUpdateSwitch === true) {
      //캐릭터 포지션 배열에 각 아이디의 현재 위치 담기
      room.users.forEach((user) => {
        //유저의 캐릭터가 움직였을때, 배열에 넣어준다.
        if (user.character.isMoved == true) {
          characterPositions.push({
            id: user.id,
            x: user.character.x,
            y: user.character.y,
          });
          //처리후 바로 캐릭터 이동체크 false로 변경.
          user.character.isMoved = false;
        }
      });

      const usersInRoom = getUsersInRoom(socket.roomId, user.id);

      // 노티 만들기
      const positionUpdateNotification = {
        characterPositions,
      };

      //전체에게 슛
      multiCast(usersInRoom, PACKET_TYPE.POSITION_UPDATE_NOTIFICATION, {
        positionUpdateNotification,
      });

      //보내고 나서 바로 스위치 끄기
      room.positionUpdateSwitch = false;
    }
  } catch (error) {
    console.log('위치 동기화 알수없는 에러', error);
  }
  //리스폰스 보내기
  //sendResponsePacket(socket,PACKET_TYPE.POSITION_UPDATE_RESPONSE,{PositionUpdateResponse,})
};
