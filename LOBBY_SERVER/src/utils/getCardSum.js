export const getCardSum = (cardLimit) => {
    let sum = 0;
    for(let i = 0; i < Object.values(cardLimit).length; i++) {
        sum += Object.values(cardLimit)[i]
    }
    return sum;
}