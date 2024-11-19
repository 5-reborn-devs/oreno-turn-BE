import IntervalManager from "../managers/interval.manager.js";
const DAY_INTERVAL = 180000; // 3분
const NIGHT_INTERVAL = 30000; 

class Game {
    constructor(id, socket){
        this.id = id;
        this.socket = socket;
        this.sequence = 0;
        this.timestamp = Date.now();
        this.phaseCode = 1
        this.intervalManager = new IntervalManager();
    }

    
    async startGame(userId) {
        this.phaseCode = 1;
        // 데이 페이즈 3분 지속
        this.intervalManager.addPhaseInterval(this.id, this.changePhase.bind(this), DAY_INTERVAL);
        


    }

    // 페이즈를 바꿔주자
    // * 비복스 안들어가면 DAY, NIGHT만 있으니까
    // * 분기문을 쓰거나, setInterval로 들어가면 좋을 것 같은데...
    changePhase() {
        if(Date.now() >= this.timestamp + DAY_INTERVAL) {
            this.phaseCode = 3; // END
            this.timestamp = Date.now(); // 페이즈가 바뀔 때의 타임스탬프로 다시 찍어준다
            
        }


    }
}