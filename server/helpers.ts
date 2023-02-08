const getRandomPricePosition = (): number => {
    // Returns a random number between 0 and 2 (indexed)
    return Math.floor(Math.random() * 3);
}

type IDoorsResult = [boolean, boolean, boolean];

// [...].filter(b => b === true) Must be exactly 1
// [...].filter(b => b === true) Must be exactly 2

export const generateRound = (): IDoorsResult => {
    const doors: IDoorsResult = [false, false, false];
    doors[getRandomPricePosition()] = true;
    return doors;
};