

let myHand = new Map();

//키값 
//cardType:카드타입 & OnHandOrder:손패에 들어온 순서
//우리 게임에서 만약에 qwer이나 1234로 버튼을 누른다는 가정하에, 키값 2개로 카드를 구분할수 있음

myHand.set('cardType',[{onHandOrder:1, value: 'firstBang'}]);
//myHand.set('cardType',[{onHandOrder:2, value: 'secondBang'}]); 이렇게 집어넣으면 터짐
myHand.get('cardType').push({onHandOrder:2, value: 'secondBang'});

//전체 조회
console.log("전체 조회 :", myHand.get('cardType')); 

//손패에 들어온 순서로 찾기
function findByOnHandOrder(myHand, key, onHandOrder){
    let card = myHand.get(key);
    if(card){
        return card.find(card=>card.onHandOrder === onHandOrder);
    }
    return undefined;
}

//두번째 손패 뱅 검색
let PickedBang = findByOnHandOrder(myHand,'cardType',2);
console.log("두번쨰 손패 뱅",PickedBang); 

