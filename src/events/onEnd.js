import { rooms, users } from '../session/session.js';
import { PACKET_TYPE } from '../constants/header.js';
import { multiCast } from '../utils/response/createResponse.js';
import { getFailCode } from '../utils/response/failCode.js';

export const onEnd = (socket) => async () => {
  // 방 정보
  const room = rooms.get(socket.roomId);
  const user = users.get(socket.token);
  const failCode = getFailCode();

  try {
    //console.log('클라이언트 연결이 종료되었습니다.');
    // 유저가 로비에 있는 경우
    if (socket.roomId === null) {
      // 유저 세션에서 제거
      users.delete(socket.token);
      console.log(`유저 ${socket.token}이 로비에서 연결이 종료되었습니다.`);
    }

    // 방에 있는 경우
    // 방, 유저 세션에서 제거
    if (socket.roomId !== null) {
      const leaveRoomNotification = {
        userId: user.id
      }

      room.removeUserById(user.id); //방에서 제거 
      console.log(`유저 ${user.id}가 방에서 연결이 종료되었습니다.`);

      multiCast(room.users, PACKET_TYPE.LEAVE_ROOM_NOTIFICATION, {
        leaveRoomNotification, // 방안에있는 다른유저들에게도 알려줌
      })

      // rooms 가 제일 최상위에 위치해요 현재 Map() 게임내에 존재하는 방들
      // 많은 방들 사이(rooms)에서 room을 get을 사용해서 가져옴
      // 방 안에 있는 유저들의 정보를 가져옴 // 살아계신가요

      // 방에 있는 내가 방장인 경우 (방을 나가는 사람이 방장인 경우) => (방 터트림)
      // 방 세션 제거, 유저 세션에서 제거
      if (room.ownerId === user.id) { // 유저가 방에 있는지
        const leaveRoomResponse = {
          success: true,
          failCode: failCode.NONE_FAILCODE,
        }
        multiCast(room.users, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
          leaveRoomResponse,
        })
        
        rooms.delete(room);
        console.log(`${socket.roomdId}번 방이 방장 ${user.nickname}에 의해 종료되었습니다.`)
      }
      users.delete(socket.token);
    }

    // 게임 안에 있는 경우 (탈주)
    // 게임, 유저 세션에서 제거
  } catch (err) {
    console.error('클라이언트 연결 종료 처리 중 오류 발생',err);
  }


};
