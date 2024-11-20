import Character from './charater.class.js';

class User {
  constructor(id, nickname = 'ironcow') {
    this.id = id;
    this.nickname = nickname;
    this.character = new Character();
  }
}

export default User;
