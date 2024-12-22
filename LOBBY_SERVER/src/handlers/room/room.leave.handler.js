import { PACKET_TYPE } from '../../constants/header.js';
import { getFailCode } from '../../utils/response/failCode.js';
import sendResponsePacket from '../../utils/response/createResponse.js';

export const leaveRoomHandler = async (socket, payloadData) => {
  const failCode = getFailCode();

  const leaveRoomResponse = {
    success: true,
    failCode: failCode.NONE_FAILCODE,
  };

  sendResponsePacket(socket, PACKET_TYPE.LEAVE_ROOM_RESPONSE, {
    leaveRoomResponse,
  });
};
