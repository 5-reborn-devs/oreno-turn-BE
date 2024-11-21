import { PACKET_TYPE } from '../../constants/header.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { rooms, users } from '../../session/session.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

// {
//     SelectCardType selectType = 1, // 0: 핸드, 1: 장비, 2: 무기, 3: 디버프
//     CardType selectCardType = 2 // selectType이  0일 경우 0, / 1, 2, 3일 경우 원하는 장비의 cardType
// }

// 어떤 경우의 카드 선택 핸들러 인지 모르겠음.
// selectType의 enum을 들고 와야함. 전부 constants에 적어두는게 맞는건가?
export const selectCardHandler = async (socket, payload) => {
  const { selectType, selectCardType } = payload;
  const failCode = getFailCode();
  let cardSelectResponse;

  try {
    // 카드ID를 통해 카드 데이터를 가져오고, 카드의 타입을 가져옴. (작성 필요)
    // 메세지 생성

    // 장착 카드인 경우 장착을 알림
    // 디버프, 등 다른 카드의 타입도 알림을 넣어야하나?
    if (selectType === 1) {
      const user = users.get(socket.token);
      const usersInRoom = getUsersInRoom(socket.roomId);
      const equipCardNotification = {
        cardType: selectCardType,
        userId: user.id,
      };
      multiCast(usersInRoom, PACKET_TYPE.EQUIP_CARD_NOTIFICATION, {
        equipCardNotification,
      });
    }

    cardSelectResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };
  } catch (errer) {
    cardSelectResponse = {
      success: false,
      failCode: failCode.UNKNOWN_ERROR,
    };
    console.error('카드 선택중 알 수 없는 에러');
  }

  sendResponsePacket(socket, PACKET_TYPE.CARD_SELECT_RESPONSE, {
    cardSelectResponse,
  });
};

// {
//     bool success = 1,
//     GlobalFailCode failCode = 2
// }

// { S2CEquipCardNotification
//     CardType cardType = 1,
//     string userId = 2
// }
