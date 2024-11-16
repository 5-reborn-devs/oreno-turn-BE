class Room {
  constructor(
    id,
    ownerId,
    name = '같이 할 사람',
    maxUserNum,
    state = 0,
    users,
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.maxUserNum = maxUserNum < 1 ? 1 : maxUserNum;
    this.state = state;
    this.users = users;
  }

  addUser(userData) {
    this.users.push(userData);
  }

  removeUser(token) {
    // 토큰을 id로 바꾸고
    // id를 찾아서 slice해서 반환
  }
  // 클래스의 입력값이 맞는지 확인하는 검증이 필요할까?
}

export default Room;
