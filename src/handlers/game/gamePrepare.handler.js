import { PACKET_TYPE } from '../../constants/header.js';
import { roleMapping } from '../../constants/roleMapping.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { rooms } from '../../session/session.js';
import { fyShuffle } from '../../utils/fisherYatesShuffle.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const gamePrepare = async (socket) => {
  const protoMessages = getProtoMessages();
  let gamePrepareResponse;
  const failCode = getFailCode();
  const roomId = socket.roomId; // socket.roomId로 통일
  const room = rooms.get(roomId); // 클라이언트가 들어가 있는 방정보를 가져옴
  try {
    room.state = protoMessages.enum.RoomStateType.values['PREPARE'];
    const usersInRoom = [...room.users]; // 방 안에 있는 모든 유저들의 정보를 가져옴
    const userCount = usersInRoom.length;
    if (userCount < 2 || userCount > 7) {
      throw new Error(`지원하지 않는 인원 수: ${userCount}`);
    }

    const characterTypes = Object.values(
      // 값들만 뽑아서 characterType에 할당
      protoMessages.enum.CharacterType.values,
    );

    characterTypes.shift();

    // 역할과 캐릭터를 셔플
    const shuffledRoles = await fyShuffle([...roleMapping[userCount]]);
    const shuffledCharacters = await fyShuffle([...characterTypes]);

    // 역할과 캐릭터를 유저에게 랜덤으로 할당
    usersInRoom.forEach((user, index) => {
      user.character.roleType =
        protoMessages.enum.RoleType.values[shuffledRoles[index]];
      user.character.characterType = shuffledCharacters[index];
    });

    room.distributeCards();

    const gamePrepareNotification = { room: room };

    const Notification = {
      gamePrepareNotification,
    };

    gamePrepareResponse = {
      success: true,
      failcode: failCode.NONE_FAILCODE,
    };
    multiCast(usersInRoom, PACKET_TYPE.GAME_PREPARE_NOTIFICATION, Notification);
  } catch (err) {
    gamePrepareResponse = {
      success: false,
      failcode: failCode.UNKNOWN_ERROR,
    };
    console.error(err);
  }
  sendResponsePacket(socket, PACKET_TYPE.GAME_PREPARE_RESPONSE, {
    gamePrepareResponse,
  });
};
