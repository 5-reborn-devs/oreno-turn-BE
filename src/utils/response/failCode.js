import { getProtoMessages } from '../../init/loadProto';

export const getFailCode = () => {
  const protoMessages = getProtoMessages();
  return protoMessages.enum.GlobalFailCode;
};
