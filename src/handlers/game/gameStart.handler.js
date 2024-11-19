import { getProtoMessages } from '../../init/loadProto.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const gameStart = (socket) => {
  const protoMesages = getProtoMessages();

  let gameStartResponse;
  try {
    gameStartResponse = {
      success: true,
      failcode: protoMesages.enum.GlobalFailCode.NONE_FAILCODE,
    };
  } catch (err) {
    gameStartResponse = {
      success: false,
      failcode: protoMesages.enum.GlobalFailCode.UNKNOWN_ERROR,
    };
  }
  sendResponsePacket(socket, PACKET_TYPE.GAME_START_RESPONSE, {
    gameStartResponse,
  });
};
