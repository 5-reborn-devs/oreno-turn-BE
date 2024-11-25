export const parseUserData = (user) => {
  const character = user.character;
  const userDatas = [];

  const parsedUserData = {
    id: user.id,
    nickname: user.nickname,
    character : {
      roleType : character.roleType === 1 ? character.roleType : 0,
      hp: character.hp,
      weapon: 0,
      stateInfo : character.stateInfo,
      equips: [],
      debuffs : character.debuffs,
      handCards : [], // 얘는 서버상에서 Map 객체이므로 빈 배열로 바꿔 보내줘야 할것 
      bbangCount : 0,
      handCardsCount: character.handCardsCount
    }
  }
  userData.push(...parsedUserData)
  return userDatas;
};

