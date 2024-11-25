import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { clients } from '../../session/session.js';
import { multiCast } from '../response/createResponse.js';

export const animationNotify = (user, type) => {
  const protoMessages = getProtoMessages();
  const animationType = protoMessages.enum.AnimationType.values;

  console.log('animationType:', animationType[type]);
  const socket = clients.get(user.id);
  const animationNotification = {
    userId: user.id,
    animationType: animationType[type],
  };

  const users = getUsersInRoom(socket.roomId);
  multiCast(users, PACKET_TYPE.ANIMATION_NOTIFICATION, {
    animationNotification,
  });
};
