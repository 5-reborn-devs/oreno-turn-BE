import { getProtoMessages } from '../../init/loadProto.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const gamePrepare = (socket) => {
  const protoMessages = getProtoMessages();
  let gamePrePareResponse;
  try {
    gamePrePareResponse = {
      success: true,
      failcode: protoMessages.enum.GlobalFailCode.NONE_FAILCODE,
    };
  } catch (err) {
    gamePrePareResponse = {
      success: false,
      failcode: protoMessages.enum.GlobalFailCode.UNKNOWN_ERROR,
    };
  }
  sendResponsePacket(
    socket,
    PACKET_TYPE.GAME_PREPARE_RESPONSE,
    gamePrePareResponse,
  );
};
