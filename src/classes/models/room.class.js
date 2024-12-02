import IntervalManager from '../managers/interval.manager.js';
import { makeCardDeck } from '../../handlers/card/index.js';
import Card from './card.class.js';
import { phaseUpdateNotificationHandler } from '../../handlers/sync/phase.update.handler.js';
import CardManager from '../managers/card.manager.js';
import { CARD_LIMIT } from '../../constants/cardTypes.js';

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
    //this.gameDeck = makeCardDeck(CARD_LIMIT); // 무작위로 섞인 카드들이 존재함 (기존기획)
    this.positionUpdateSwitch = false;
    this.isMarketOpen = false;
    this.isPushed = true;
    this.intervalId = null;
    this.isEveningDraw = false;
    this.marketRestocked = [];
    this.cardManager = new CardManager(makeCardDeck(CARD_LIMIT));
  }

  distributeCards() {
    // 첫 카드 분배
    const cardsPerUser = 5; // 처음에 주는 카드 개수 5개 // 리롤
    this.users.forEach((user) => {
      user.character.handCardsCount = 0;
      const cards = [];

      for (let i = 0; i < cardsPerUser; i++) {
        const cardType = this.gameDeck.pop();
        if (cardType) {
          const card = new Card(cardType, 1);
          cards.push(card);
        }
      }

      cards.forEach((card) => {
        user.character.addCard(card);
      });
    });
  }

  addUser(userData) {
    this.users.push(userData);
  }

  removeUserById(userId) {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index != -1) {
      return this.users.splice(index,1)[0];
    } else {
      return false;
    }
  }
  getIntervalManager() {
    return this.intervalManager;
  }
  positionUpdateOn() {
    this.positionUpdateOn = true;
  } //포지션 업데이트 노티 받기 위한 스위치 온

  button(socket) {
    if (this.isPushed) {
      this.startCustomInterval();
      this.isPushed = false;
    }
  }

  startCustomInterval() {
    const intervals = [18000, 6000, 18000];
    let currentIndex = 0;
    const room = this;
    function runInterval() {
      // 다음 인터벌 설정
      currentIndex = (currentIndex + 1) % intervals.length;
      const nextState = intervals[currentIndex];
      phaseUpdateNotificationHandler(room, nextState);
      room.intervalId = setTimeout(runInterval, nextState);
    }
    this.intervalId = setTimeout(runInterval, intervals[currentIndex]);
  }

   stopCustomInterval(){ 
      if (this.intervalId){ 
        clearTimeout(this.intervalId); 
        // 타이머 중지 
        this.intervalId = null; // 타이머 ID 초기화 
      } 
  }

}

export default Room;
