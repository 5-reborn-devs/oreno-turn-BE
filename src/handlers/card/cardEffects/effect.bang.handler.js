import CharacterState from '../../../classes/models/character.state.class.js';
import { getProtoMessages } from '../../../init/loadProto.js';
import { getUserById } from '../../../session/user.session.js';

export const bbangEffectHandler = async (user, targetUserId) => {
  let errorMessage = '';
  const protoMessages = getProtoMessages();
  const stateType = protoMessages.enum.CharacterStateType.values;

  try {
    // 내 캐릭터 정보 가져오기
    const myCharacter = user.character;

    myCharacter.stateInfo = new CharacterState(
      stateType.BBANG_SHOOTER,
      0,
      0,
      targetUserId,
    );

    const targetUser = getUserById(targetUserId);
    const targetCharacter = targetUser.character;

    targetCharacter.stateInfo = new CharacterState(
      stateType.BBANG_TARGET,
      0,
      0,
      user.id,
    );
  } catch (error) {
    console.error(errorMessage, error);
    return errorMessage;
  }
};
