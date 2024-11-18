class User {
  constructor(id, nickname = 'ironcow', character = null) {
    this.id = id;
    this.nickname = nickname;
    this.character = character;
  }
}

export default User;
