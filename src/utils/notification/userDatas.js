import { getUserById } from "../../session/user.session.js";

// 유저 상태 업데이트 노티를 위한 데이터
export const parseUserData = (user) => {
    user.roleType = 0;
    user.weapon = null;
    user.stateInfo = null;
    user.debuffs = [];
    user.handCards = [];
    user.bbangCount = 0;

  return user;
};
