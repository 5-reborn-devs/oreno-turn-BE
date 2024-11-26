import { PACKET_TYPE } from '../../constants/header.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { rooms } from '../../session/session.js';
import { multiCast } from '../../utils/response/createResponse.js';

// 플리마켓 노티 - 플리마켓 시작합니다! 라는 노티가 가야한다
export const fleamarketNotificationHanlder = (socket) => {
  const roomId = socket.roomId;
  const allUsersInRoom = getUsersInRoom(roomId);

  // 덱에서 랜덤으로 카드 추출 - 종류별로 매수 제한 있음
  const fleamarketCards = [];

  multiCast(allUsersInRoom, PACKET_TYPE.FLEAMARKET_NOTIFICATION, {});
};
