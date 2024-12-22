import { handleTimeout } from '../../handlers/sync/heartBeat.handler.js';
import Character from './character.class.js';

class User {
  constructor(id, nickname = 'ironcow') {
    this.id = id;
    this.nickname = nickname;
    this.character = new Character();
    this.isEndIgnore = false;

    // 핑 관련 속성
    this.lastPingTime = Date.now(); // 마지막 Ping 시간 기록
    this.pingTimeout = null; // 타임아웃 관리
  }
  // 마지막 핑 시간 업데이트
  updatePingTime(socket) {
    this.lastPingTime = Date.now();
    this.resetPingTimeout(socket, () => handleTimeout(socket), 5000); // 새로운 타이머 설정
    console.log('들어왔는가');
  }

  // 타임아웃 초기화
  resetPingTimeout(socket, onTimeout, timeoutInterval) {
    clearTimeout(this.pingTimeout); // 기존 타이머 클리어

    this.pingTimeout = setTimeout(() => {
      const currentTime = Date.now();
      const timeElapsed = currentTime - this.lastPingTime;

      if (timeElapsed > timeoutInterval) {
        console.log(`유저 ${this.id} - 핑 타임아웃 발생, 연결 종료 처리`);
        this.isEndIgnore = true;
        onTimeout(socket); // 연결 종료 처리 콜백 호출
      }
    }, timeoutInterval); // 지정된 타임아웃 간격
  }

  // 핑 타임아웃 제거 (연결 종료 시 호출)
  clearPingTimeout() {
    clearTimeout(this.pingTimeout);
    this.pingTimeout = null;
  }
}

export default User;
