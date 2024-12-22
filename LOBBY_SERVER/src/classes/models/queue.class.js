import fastq from 'fastq';

class Queue {
  constructor(setTime) {
    this.recentTasks = new Set();
    this.setTime = setTime;
    this.requestQueue = fastq(this.RequestWorker, 1);
  }

  async RequestWorker(task, callback) {
    await task.task(...task.args);
    callback(null); // 작업 완료 후 콜백 호출
  }

  // RequestQueue push 함수 : 중복 방지
  addRequest(socket, packetType, payload, task) {
    if (this.recentTasks.has(packetType)) {
      console.log(`Task ${packetType} 중복 스킵!!`);
      return;
    }

    // 최근 작업에 추가
    if (packetType !== 33 || packetType !== 56) {
      this.recentTasks.add(packetType);
    }
    this.requestQueue.push({ args: [socket, payload], task }, (err) => {
      if (err) {
        console.error('Task failed:', err);
      } else {
        //설정 시간 뒤에 set 데이터 제거
        setTimeout(() => {
          this.recentTasks.delete(packetType);
          console.log(`Task ${packetType} 제거!`);
        }, this.setTime);
      }
    });
  }
}

export default Queue;
