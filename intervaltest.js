// 페이즈 업데이트
// 여기서 페이즈가 알아서 돌아가도록 해보고, 잘 돌아가면 서버에 붙이면 된다
// 너무 어렵게 생각하지 말것
// 로그라이크에서 선택지를 고르고 엔터키를 누르면 턴이 바뀌었던것 처럼
// 여기서는 아무런 인풋이 없어도 무언가가 턴을 바꿔줘야 할것
// 이걸 깨달았다면 gameState는 직관적으로 알 수 있을 것
// userState가 좀 난해할 것 -> gameState가 해결되면 userState 도 감이 올것

import IntervalManager from './src/classes/managers/interval.manager.js';

const DAY_INTERVAL = 180000; // 3분
const NIGHT_INTERVAL = 30000;

const intervalManager = new IntervalManager();
const gameId = '1234';
let phaseCode = 3;
let timestamp = Date.now();

const changePhase = async (gameId, phaseCode) => {
  if (phaseCode === 1) {
    phaseCode = 3;
    // 낮이라면 페이즈코드를 밤으로 바꾸고 밤을 돌려 30초 뒤 다시 낮이 돌아가게 한다
    intervalManager.removePhaseInterval(gameId);
    intervalManager.addPhaseInterval(
      gameId,
      changePhase.bind(this, gameId, phaseCode),
      2000,
    );
    console.log(`지금 페이즈는 ${phaseCode}, 밤 페이즈 돌아갑니다`);
    console.log(Date.now());
  } else if (phaseCode === 3) {
    phaseCode = 1;
    // 밤이라면 페이즈코드를 낮으로 바꾸고 낮을 돌려 3분 뒤 다시 밤이 돌아가게 한다
    intervalManager.removePhaseInterval(gameId);
    intervalManager.addPhaseInterval(
      gameId,
      changePhase.bind(this, gameId, phaseCode),
      4000,
    );
    console.log(`지금 페이즈는 ${phaseCode}, 낮 페이즈 돌아갑니다`);
    console.log(Date.now());
  }
};

const phaseStart = async (gameId, phaseCode) => {
    const START_INTERVAL = 2000;
  console.log(`${START_INTERVAL / 1000}초 뒤에 게임 시작합니다!`);
  intervalManager.addPhaseInterval(
    gameId,
    changePhase.bind(this, gameId, phaseCode),
    START_INTERVAL,
  );
};

await phaseStart(gameId, phaseCode);
