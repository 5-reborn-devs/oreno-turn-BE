import CharacterState from '../../../classes/models/character.state.class.js';
import { getProtoMessages } from '../../../init/loadProto.js';
import { getUserById } from '../../../session/user.session.js';

// enum CharacterStateType {
//     NONE_CHARACTER_STATE = 0;
//     BBANG_SHOOTER = 1; // 빵야 시전자
//     BBANG_TARGET = 2; // 빵야 대상 (쉴드 사용가능 상태)
//     DEATH_MATCH_STATE = 3; // 현피 중 자신의 턴이 아닐 때
//     DEATH_MATCH_TURN_STATE = 4; // 현피 중 자신의 턴
//     FLEA_MARKET_TURN = 5; // 플리마켓 자신의 턴
//     FLEA_MARKET_WAIT = 6; // 플리마켓 턴 대기 상태
//     GUERRILLA_SHOOTER = 7; // 게릴라 시전자
//     GUERRILLA_TARGET = 8; // 게릴라 대상
//     BIG_BBANG_SHOOTER = 9; // 난사 시전자
//     BIG_BBANG_TARGET = 10; // 난사 대상
//     ABSORBING = 11; // 흡수 중
//     ABSORB_TARGET = 12; // 흡수 대상
//     HALLUCINATING = 13; // 신기루 중
//     HALLUCINATION_TARGET = 14; // 신기루 대상
//     CONTAINED = 15; // 감금 중
// }

// message CharacterData {
//     CharacterType characterType = 1;
//     RoleType roleType = 2;
//     int32 hp = 3;
//     int32 weapon = 4;
//     CharacterStateInfoData stateInfo = 5;
//     repeated int32 equips = 6;
//     repeated int32 debuffs = 7;
//     repeated CardData handCards = 8;
//     int32 bbangCount = 9;
//     int32 handCardsCount = 10;
// }

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

    console.log('상태', myCharacter.stateInfo);

    const targetUser = getUserById(targetUserId);
    const targetCharacter = targetUser.character;

    targetCharacter.stateInfo = new CharacterState(
      stateType.BBANG_TARGET,
      0,
      0,
      user.id,
    );

    myCharacter.bbangCount += 1;
  } catch (error) {
    console.error(errorMessage, error);
    return errorMessage;
  }
};
