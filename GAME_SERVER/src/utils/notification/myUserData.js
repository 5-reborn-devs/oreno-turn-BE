export const parseMyData = (user) => {
  const character = user.character;
  const handCardsArray = [];

  for (const [key, value] of character.handCards.entries()) {
    handCardsArray.push({ type: key, count: value });
  }

  const parsedMyData = {
    id: user.id,
    nickname: user.nickname,
    character: {
      characterType: character.characterType,
      roleType: character.roleType === 1 ? character.roleType : 0,
      hp: character.hp,
      weapon: 0,
      stateInfo: character.stateInfo,
      equips: character.equips,
      debuffs: character.debuffs,
      handCards: handCardsArray, 
      bbangCount: 0,
      handCardsCount: character.handCardsCount,
    },
  };

  return parsedMyData;
};
