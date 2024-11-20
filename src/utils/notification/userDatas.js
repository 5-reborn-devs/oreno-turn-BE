import { getUserById } from "../../session/user.session.js";

// 유저 상태 업데이트 노티를 위한 데이터
export const parseUserData = (id, user) => {
  const character = user.character

  const userData = {
    id: user.id,
    nickname: user.nickname,
    character: user.character,
    characterType: character.characterType,
    roleType: character.roleType,
    hp: character.hp,
    weapon: character.weapon,
    stateInfo: character.stateInfo,
    equips: character.equips,
    debuffs: character.debuffs,
    handCards: character.handCards,
    bbangCount: character.bbangCount,
    handCardsCount: character.handCardsCount,
  };

  // 타인이고 타겟유저도 아닌 경우 데이터를 가려준다
  if (getUserById(id) !== user && character.roleType !== 1) {
    userData.roleType = 0
    userData.weapon = null;
    userData.stateInfo = null;
    userData.debuffs = [];
    userData.handCards = [];
    userData.bbangCount = 0;
  } else if (getUserById(id) !== user && character.roleType === 1) {
    // 타인 중 유저타입이 타겟인 경우는 롤타입 오픈이므로 수정하지 않는다
    userData.weapon = null;
    userData.stateInfo = null;
    userData.debuffs = [];
    userData.handCards = [];
    userData.bbangCount = 0;
  }

  return userData;
};
