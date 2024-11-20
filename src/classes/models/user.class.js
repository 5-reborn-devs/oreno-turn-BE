class User {
  constructor(id, nickname = 'ironcow', character = null) {
    this.id = id;
    this.nickname = nickname;
    this.character = character;
    this.x;
    this.y;
    this.characterType = 0;
  }

  updatePositon(x,y){
    console.log("위치 업데이트 들어왔어연");
    this.lastX = this.x;
    this.lastY = this.y;
    this.x = x;
    this.y = y;
    this. lastUpdateTime = Date.now();
  }
}

export default User;
