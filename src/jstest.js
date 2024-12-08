function sayHi(phrase, who) {
    console.log("phrase: ",phrase," who: ",who); 
  }

let index = [5000,2000,5000]
let currentIndex = 0;

function RecycleTest(){
    console.log("현재 인터벌: ",index[currentIndex]);

    if(currentIndex ==2){
        currentIndex =0;
    }
    else{
        currentIndex +=1;
    }
    setInterval(RecycleTest,index[currentIndex],)
}

  let timerId = setTimeout(sayHi, 1000, "Hello", "John"); // 함수이름, 시간, 함수에 들어가는 인자값1, 인자값2..
  //setTimeout(sayHi(), 1000);      //sayHi()가 실행되면 undefined가 리턴됨. 잘못됨!!

  clearTimeout(timerId); //아이디를 지정해주고 클리어 타임아웃으로 날려버릴수도 있다.

  let intervalId = setInterval(RecycleTest, index[currentIndex],);