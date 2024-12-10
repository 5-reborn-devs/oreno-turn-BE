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
    this.phaseType = 1; // DAY:1, NIGHT:3
    //this.gameDeck = makeCardDeck(CARD_LIMIT); // 무작위로 섞인 카드들이 존재함 (기존기획)
    this.positionUpdateSwitch = false;
    this.isMarketOpen = false;
    this.isPushed = true;
    this.intervalId = null;
    this.positionIntervalid = null;
    this.marketRestocked = [];
    this.cards = new CardManager(makeCardDeck(CARD_LIMIT));
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

  // positionUpdateOn() {
  //   this.positionUpdateOn = true;
  // } //포지션 업데이트 노티 받기 위한 스위치 온


  positionUpdateOn() { 
    if (this.positionUpdateSwitch === false){ 
      this.positionUpdateSwitch = true; 
      console.log("포지션 업데이트 킴!"); }  
    }

  positionUpdateInterval() { 
    const room = this; console.log("포지션 인터벌 시작"); 
    this.positionIntervalid = setInterval(function () { 
      room.positionUpdateOn(); }, 100); 
      // 함수를 전달 
      } 
  
  
  button(nextPhaseAt) {
    if (this.isPushed) {
      this.startCustomInterval(nextPhaseAt);
      this.positionUpdateInterval();
      this.isPushed = false;
    }
  }

  startCustomInterval(nextPhaseAt) {
    const intervals = [18000, 12000, 18000]; // afternoon, evening, night
    let currentIndex = 0;
    const room = this;
    function runInterval() {

      // 다음 인터벌 설정
      currentIndex = (currentIndex + 1) % intervals.length;

      let drifted = nextPhaseAt - Date.now();
      console.log("시간값 두개 먼저 보여줘! :",nextPhaseAt,Date.now());
      console.log("드리프트 값!: ",drifted); // 초기값+페이즈 원론적인 시간에서 실제 시간과 비교해서 차이 구하기

      nextPhaseAt += intervals[currentIndex]; // 원론적인 다음 페이즈 시간 업데이트

      const nextState = intervals[currentIndex] + drifted; // 넥스트 페이즈에 시간차이 게산 더해주기

      phaseUpdateNotificationHandler(room, nextState);  //페이즈 업데이트 핸들러 호출 
      
      room.intervalId = setTimeout(runInterval, nextState); //다음 인터벌 설정(next state 보정 처리)
    }

    const firstDelay = nextPhaseAt - Date.now();     //첫 인터벌 지연시간 계산

    this.intervalId = setTimeout(runInterval, firstDelay);     //첫 인터벌 시작(보정값) 
  }

  stopCustomInterval() {
    console.log('커스텀 인터벌 지우기 실행 되었음!!!!');

    if (this.intervalId) {
      clearTimeout(this.intervalId);
      clearTimeout(this.positionIntervalid);
      // 타이머 중지
      this.intervalId = null; // 타이머 ID 초기화
    }
  }
}

export default Room;
