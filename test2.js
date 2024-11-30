import {
  CARD_LIMIT,
  CARD_TYPES,
  CARD_TYPES_INDEX,
} from './src/constants/cardTypes.js';
import { fyShuffle } from './src/utils/fisherYatesShuffle.js';

const randomNum =
  Math.floor(Math.random() * Object.values(CARD_TYPES).length) + 1;
const test2 = Math.floor(Math.random() * 3) + 1;
const randomCardType = CARD_TYPES_INDEX[randomNum];

const gameDeck = [];
for (let i = 0; i <= Object.keys(CARD_TYPES).length; i++) {
  const deckCard = Object.keys(CARD_TYPES_INDEX)[i];
  // console.log('Object.keys(CARD_LIMIT)?: ', Object.values(CARD_LIMIT)[i])
  for (let j = 0; j < Object.values(CARD_LIMIT)[i]; j++) {
    gameDeck.push(parseInt(deckCard));
  }
}
const pickedCards = [];

for (let i = 0; i < 2; i++) {
  pickedCards.push(gameDeck.pop());
}
console.log(pickedCards);

await fyShuffle(gameDeck);

console.log('함수 전 게임덱', gameDeck);
const maturedSavings = async (gameDeck) => {
  gameDeck.splice(0, 2);
};

await maturedSavings(gameDeck);

console.log('함수 후 게임덱', gameDeck);

const handCards = new Map();
handCards.set(1, 11);
handCards.set(2, 3);

const cardType = 2;
let handCardCount = handCards.get(cardType);
handCards.set(cardType, --handCardCount);

const pickedCard = [11, 5, 7, 2];
pickedCard.forEach((cardType) => {
  let count = handCards.get(cardType);
  count = !!count ? count : 0;
  handCards.set(cardType, ++count);
});

const array = []
for (const [key, value] of handCards.entries()) {
  array.push({type: key, count: value})
  console.log('테스트!', array)

}

console.log('handCards?:', handCards)
console.log('has?:', handCards.has(cardType))


// console.log('mapToArray?: ', mapToArray)

// let a = 1;
// console.log(++a)

// const handCards = new Map();
// handCards.set(1, 3)
// handCards.set(2, 3)

// const cardDeck = makeCardDeck();
// const pickedCards = cardDeck.splice(0, 2);
// 얻은 카드의 타입과 장수를 handCards에 set으로 넣어준다
// pickedCards.forEach((pickedCardType) => {
//   let count = handCards.get(pickedCardType);
//   count = !!count ? count : 0;
//   handCards.set(pickedCardType, ++count);
// });
