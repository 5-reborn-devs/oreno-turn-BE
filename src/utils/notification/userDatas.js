export const parseUserData = (user) => {
  user.roleType = 0;
  user.weapon = null;
  user.stateInfo = null;
  user.debuffs = [];
  user.handCards = [];
  user.bbangCount = 0;

  return user;
};
