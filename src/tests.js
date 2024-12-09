import CardManager from "./classes/managers/card.manager.js";
import User from "./classes/models/user.class.js";


const user = new User();
const Cards = new CardManager(user.character.privateDeck);

console.log(user.character.hp);

console.log(Cards.deck);
