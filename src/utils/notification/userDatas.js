// 유저 상태 업데이트 노티
export const updatedUserData = (user) => {
    return {
      chracterType: user.character.characterType,
      roletype: user.character.roletype,
      hp: user.character.hp,
      weapon: user.character.weapon,
      stateInfo: user.character.stateInfo,
      equips: user.character.equips,
      debuffs: user.character.debuffs,
      handCards: user.character.handCards,
      bbangCount: user.character.bbangCount,
      handCardsCount: user.character.handCardsCount
    }
  }