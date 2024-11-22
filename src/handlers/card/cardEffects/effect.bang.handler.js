import { PACKET_TYPE } from '../../constants/header.js';
import { getUsersInRoom } from '../../session/room.session.js';
import { rooms, users } from '../../session/session.js';
import {
  multiCast,
  sendResponsePacket,
} from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { getUserById } from '../../../session/user.session.js';
import CharacterState from '../../../classes/models/character.state.class.js';

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

// 뱅이 발동되면 무슨일이 벌어져야하는지 알아보자
// 1. characterState가 바뀌어야함.
// 2. Character의 뱅카운트를 바꿔줘야함

export const bbangEffectHandler = async (user, targetUserId) => {
  const failCode = getFailCode();
  let errorMessage = '';
  // 캐릭터 스테이트 enum을 getProtomessages에서 불러기
  const protoMessages = getProtoMessages();
  const stateType = protoMessages.enum.CharacterStateType.values; // values 붙여줘야함!

  try {
    // 내 캐릭터 정보 가져오기
    const myCharacter = user.character; // Character 객체임
    let stateInfo = myCharacter.CharacterState;
  
    // user의 캐릭터의 characterState를 shooter 상태로 바꿔주기, character.class.js 참고!
    // stateInfo 도 객체임! character.state.class.js 참고!
    stateInfo = {
        state: stateType.BBANG_SHOOTER,
        nextState: 0,
        nextStateAt: Date.now() + 1000, 
        stateTargetUserId: targetUserId,
    }
    
    const targetUser = getUserById(targetUserId);  // getUserById는 User객체를 가져옴. Character가 아님
    const targetCharacter = targetUser.character;
    
    // 대상 캐릭터의 state를 bangTarget으로 바꿔주기
    targetCharacter.stateInfo = {
        state: stateType.BBANG_TARGET,
        nextState: 0,
        nextStateAt: Date.now() + 1000,
        stateTargetUserId: user.id,
    }
    // 나의 유저 아이디가 필요.
    // 캐릭터가 카드를 사용하면 공격 카운터 증가시켜주기
    myCharacter.bbangCount += 1; // 조건문이 필요한가? 그냥 증가해도 괜찮은가

  } catch (error) {
    console.error(errorMessage, error);
    return errorMessage;
  }
};

// 검증
// 뱅을 사용할 때 상대가 이미 상태 처리 중이라면 ? 
// 