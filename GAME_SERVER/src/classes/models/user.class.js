import Character from './character.class.js';

class User {
  constructor(id, nickname = 'ironcow') {
    this.id = id;
    this.nickname = nickname;
    this.character = new Character();
    this.isEndIgnore = false;
  }
}

export default User;
