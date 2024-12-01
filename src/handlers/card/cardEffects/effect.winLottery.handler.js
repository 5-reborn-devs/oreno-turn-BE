import { userUpdateNotifyForEachUser } from "../../../utils/notification/userUpdateNoti.js";

export const winLotteryHandler = async (user, gameDeck, targetUserId) => {
    const character = user.character
    const earningCount = 3;

    const pickedCards = gameDeck.splice(0, earningCount);
    // 얻은 카드의 타입과 장수를 handCards에 set으로 넣어준다
    pickedCards.forEach((pickedCard) => {
      character.addCardByType(pickedCard)
    });

    userUpdateNotifyForEachUser(user)
  };