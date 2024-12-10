import { redisManager } from '../../classes/managers/redis.manager.js';
import Room from '../../classes/models/room.class.js';
import User from '../../classes/models/user.class.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { clients, games, rooms, users } from '../../session/session.js';
import { fyShuffle } from '../../utils/fisherYatesShuffle.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const gamePrepare = async (socket) => {
  const protoMessages = getProtoMessages();
  let gamePrepareResponse;
  const failCode = getFailCode();
  const roomId = socket.roomId;

  try {
    const redisUsers = await redisManager.rooms.getUsersData(roomId); // 방 안에 있는 모든 유저들의 정보를 가져옴
    const usersInRoom = redisUsers.map((user) => {
      const newUser = new User(Number(user.id), user.nickname);
      users.set(clients.get(newUser.id).token, newUser);
      return newUser;
    });
    console.log('prepare Users:', users);

    const redisRoom = await redisManager.rooms.getRoom(roomId); // 클라이언트가 들어가 있는 방정보를 가져옴
    const room = new Room(
      Number(redisRoom.id),
      Number(redisRoom.ownerId),
      redisRoom.name,
      Number(redisRoom.maxUserNum),
      redisRoom.state,
      usersInRoom,
    );
    rooms.set(roomId, room);
    console.log('prepare Rooms', rooms);

    room.state = protoMessages.enum.RoomStateType.values['PREPARE'];
    const userCount = usersInRoom.length;
    if (userCount < 2 || userCount > 7) {
      throw new Error(`지원하지 않는 인원 수: ${userCount}`);
    }

    const characterTypes = Object.values(
      // 값들만 뽑아서 characterType에 할당
      protoMessages.enum.CharacterType.values,
    );

    characterTypes.shift();

    // 캐릭터를 셔플
    const shuffledCharacters = await fyShuffle([...characterTypes]);

    // 역할과 캐릭터를 유저에게 랜덤으로 할당
    usersInRoom.forEach((user, index) => {
      user.character.roleType =
        protoMessages.enum.RoleType.values['PSYCHOPATH'];
      user.character.characterType = shuffledCharacters[index];
    });

    // 방 유저들에게 초기 카드를 분배
    // room.distributeCards();

    const gamePrepareNotification = { room: room };

    const Notification = {
      gamePrepareNotification,
    };

    gamePrepareResponse = {
      success: true,
      failcode: failCode.NONE_FAILCODE,
    };
    multiCast(usersInRoom, PACKET_TYPE.GAME_PREPARE_NOTIFICATION, Notification);

    // 방 정보를 게임세션으로 이전 후 방을 삭제
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
