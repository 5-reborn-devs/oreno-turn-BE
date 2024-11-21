import { getProtoMessages } from '../../init/loadProto.js';

export const getFailCode = () => {
  const protoMessages = getProtoMessages();
  return protoMessages.enum.GlobalFailCode.values;
};
