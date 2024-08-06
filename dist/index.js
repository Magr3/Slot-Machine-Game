"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
const NUMBER_OF_ROWS = 3;
const NUMBER_OF_COL = 3;
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};
const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};
const depositMoney = () => {
    let depositAmount;
    let numericDepositAmount = NaN;
    do {
        depositAmount = prompt('Enter a deposit amount: ');
        numericDepositAmount = parseFloat(depositAmount);
        if (isNaN(numericDepositAmount) || numericDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        }
        ;
    } while (isNaN(numericDepositAmount) || numericDepositAmount <= 0);
    return numericDepositAmount;
};
const getNumberOfLines = () => {
    let lines;
    let numberOfLines;
    do {
        lines = prompt('Number of lines to bet (1-3): ');
        numberOfLines = parseFloat(lines);
        if (isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3) {
            console.log("Invalid choice");
        }
        else {
            console.log(`Nice, you bet on ${numberOfLines} lines`);
        }
    } while (isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3);
    return numberOfLines;
};
const getBetAmount = (balance, lines) => {
    let betAmount;
    let numericBetAmount;
    do {
        betAmount = prompt('Enter the bet per line: ');
        numericBetAmount = parseFloat(betAmount);
        if (isNaN(numericBetAmount) || numericBetAmount < 0 || numericBetAmount > balance / lines) {
            console.log("Invalid amount, tray again");
        }
    } while (isNaN(numericBetAmount) || numericBetAmount < 0 || numericBetAmount > balance / lines);
    return numericBetAmount;
};
const spinReels = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < NUMBER_OF_COL; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < NUMBER_OF_ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};
const transposeMatrix = (reels) => {
    const rows = [];
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < NUMBER_OF_COL; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};
const printSlotMachine = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i !== rows.length) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
};
const game = () => {
    let balance = depositMoney();
    while (true) {
        console.log(`You have a balnce of €${balance}`);
        const numberOfBettingLines = getNumberOfLines();
        const betAmount = getBetAmount(balance, numberOfBettingLines);
        balance -= betAmount * numberOfBettingLines;
        const spinResult = spinReels();
        const transposedRows = transposeMatrix(spinResult);
        printSlotMachine(transposedRows);
        const winningsAmount = getWinnings(transposedRows, betAmount, numberOfBettingLines);
        balance += winningsAmount;
        console.log(`You won, €${winningsAmount}`);
        if (balance <= 0) {
            console.log("GameOver, You run out of money");
            break;
        }
        let playAgain = "";
        do {
            playAgain = prompt("Do you wanna play again (y/n)?  ");
            playAgain = playAgain.toLowerCase();
        } while (playAgain !== "y" && playAgain !== "n");
        if (playAgain !== "y") {
            console.log("Thanks for playing!");
            break;
        }
    }
};
game();
//# sourceMappingURL=index.js.map