import IntervalManager from '../managers/interval.manager.js';
import { makeCardDeck } from '../../handlers/card/card.js';

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
    this.intervalManager = new IntervalManager();
    this.phaseType = 1; // DAY:1, NIGHT:3
    this.gameDeck = makeCardDeck();
  }

  addUser(userData) {
    this.users.push(userData);
  }

  removeUserById(userId) {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index != -1) {
      return this.users.splice(index, 1)[0];
    } else {
      return false;
    }
  }
  getIntervalManager() {
    console.log('겟 인터벌 매니저!');
    return this.intervalManager;
  }

  // 클래스의 입력값이 맞는지 확인하는 검증이 필요할까?
}

export default Room;
