import { getFailCode } from '../../../utils/response/failCode.js';
import { getProtoMessages } from '../../../init/loadProto.js';
import { getUserById } from '../../../session/user.session.js';
import { reactionHandler } from '../../game/game.reaction.handler.js';
import { clients } from '../../../session/session.js';

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

export const shieldEffectHandler = async (user, targetUserId) => {
  let errorMessage = '';
  const protoMessages = getProtoMessages();
  const stateType = protoMessages.enum.CharacterStateType.values;

  try {
    // 유저 캐릭터 들고오기
    const myCharacter = user.character;
    let stateInfo = myCharacter.CharacterState;
    console.log('targetId', targetUserId);
    console.log('userId', user.id);

    // 유저 캐릭터의 상태를 바꾸기 // 뱅 상태 -> 0
    // stateInfo = {
    //   state: 0,
    //   nextState: 0,
    //   nextStateAt: 1,
    //   stateTargetUserId: targetUserId,
    // };

    // 상대 캐릭터 들고오기
    const targetUser = getUserById(targetUserId);
    const targetCharacter = targetUser.character;

    // 상대 캐릭터 상태 바꾸기 // 뱅타겟 -> 0
    // targetCharacter.stateInfo = {
    //   state: 0,
    //   nextState: 0,
    //   nextStateAt: 1,
    //   stateTargetUserId: user.id,
    // };

    // reactionHandler(clients.get(user.id), {});
  } catch (error) {
    console.error(errorMessage, error);
    return errorMessage;
  }
};
// 이거거던
