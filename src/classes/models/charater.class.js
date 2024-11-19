import CharacterState from './charater.state.class';

class Charater {
  constructor(characterType, roleType, hp) {
    this.characterType = characterType;
    this.roleType = roleType;
    this.hp = hp;
    this.weapon = null;
    this.stateInfo = new CharacterState();
    this.equips = [];
    this.debuffs = [];
    this.handCards = [];
    this.bbangCount = 0;
    this.handCardsCount = 0;
  }
}

export default Charater;
