import { CARD_TYPES } from "../../constants/cardTypes.js";

export const laserPointerHandler = async (user, gameDeck, targetUserId) => {
    const character = user.character;
    const equips = character.equips;

    // 레이저 포인터는 장비 아이템 - 장비탭에 있는지 보고 없으면 넣어줘야 함
    if(!equips.includes(CARD_TYPES.LASER_POINTER)) {
        character.addEquip(CARD_TYPES.LASER_POINTER)
    }
}