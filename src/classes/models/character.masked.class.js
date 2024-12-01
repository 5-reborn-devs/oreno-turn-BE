class MaskedCharacter {
  constructor(character) {
    // Character 클래스 인스턴스에서 데이터를 받아옴.
    this.characterType = character.characterType;
    this.roleType = character.roleType;
    this.hp = character.hp;
    this.stateInfo = character.stateInfo;
    this.debuffs = [];
    this._weapon = null;
    this._equips = new Map();
    this._handCards = new Map();
    this.bbangCount = 0;
    this.handCardsCount = 0;
    this._privateDeck = character.privateDeck;
  }
}
