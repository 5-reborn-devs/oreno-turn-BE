import { getUserById } from '../../../session/user.session.js';
import CharacterState from '../../../classes/models/character.state.class.js';

export const shieldEffectHandler = async (user, targetUserId) => {
  let errorMessage = '';

  try {
    // 유저 캐릭터 들고오기
    const myCharacter = user.character;

    // 유저 캐릭터의 상태 초기화
    myCharacter.stateInfo = new CharacterState();

    // 상대 캐릭터 들고오기
    const targetUser = getUserById(targetUserId);
    const targetCharacter = targetUser.character;

    // 상대 캐릭터 상태 초기화
    targetCharacter.stateInfo = new CharacterState();
  } catch (error) {
    console.error(errorMessage, error);
    return errorMessage;
  }
};
