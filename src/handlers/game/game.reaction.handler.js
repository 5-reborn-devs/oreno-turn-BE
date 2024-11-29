import CharacterState from '../../classes/models/character.state.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import {
  getUsersInRoom,
  getUsersWithoutMe,
} from '../../session/room.session.js';
import { clients, rooms, users } from '../../session/session.js';
import { getUserById } from '../../session/user.session.js';
import { parseMyData } from '../../utils/notification/myUserData.js';
import { parseUserDatas } from '../../utils/notification/userDatas.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const reactionHandler = async (socket) => {
  const failCode = getFailCode();
  let reactionResponse;

  try {
    // 공격당한 유저의 정보
    const user = users.get(socket.token);
    const character = user.character;
    let stateInfo = character.stateInfo;

    // 뱅을 쏜 유저의 상태를 초기화
    const shooterId = stateInfo.stateTargetUserId;
    const shooter = getUserById(shooterId);
    shooter.character.stateInfo = new CharacterState();

    // 공격당한 유저의 상태를 초기화
    character.stateInfo = new CharacterState(); // 만약 state = new CharacterState로 초기화하면 반영안됨.
    character.hp -= 1;

    reactionResponse = {
      success: true,
      failCode: failCode.NONE_FAILCODE,
    };

    // 리액션 종료 후 유저 상태 동기화
    const roomId = socket.roomId;
    const allUsersInRoom = getUsersInRoom(roomId);
    allUsersInRoom.forEach((user) => {
      const otherUsers = getUsersWithoutMe(roomId, user.id);
      // client 세션 데이터 검색
      const socketById = clients.get(user.id);
      const userDatas = [parseMyData(user), ...parseUserDatas(otherUsers)];
      sendResponsePacket(socketById, PACKET_TYPE.USER_UPDATE_NOTIFICATION, {
        userUpdateNotification: {
          user: userDatas,
        },
      });
    });
  } catch (error) {
    reactionResponse = {
      success: false,
      failCode: failCode.UNKNOWN_ERROR,
    };

    console.error('리액션 실패: ', error);
  }

  sendResponsePacket(socket, PACKET_TYPE.REACTION_RESPONSE, {
    reactionResponse,
  });
};

