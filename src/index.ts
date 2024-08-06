// @ts-ignore
import promptSync from "prompt-sync";
const prompt = promptSync();

const NUMBER_OF_ROWS : number = 3;
const NUMBER_OF_COL : number = 3;

const SYMBOLS_COUNT : { [key : string] : number } = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

const SYMBOLS_VALUES : { [key : string] : number } = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};




//Chide al giocatore di depositare una quantita di soldi, che userà come saldo per giocare.
const depositMoney = (): number => {

    let depositAmount: string;
    let numericDepositAmount : number = NaN;

    do {
        depositAmount = prompt('Enter a deposit amount: ');
        numericDepositAmount = parseFloat(depositAmount);
            
        if (isNaN(numericDepositAmount) || numericDepositAmount <= 0){
            console.log("Invalid deposit amount, try again.");
        };
    
    } while (isNaN(numericDepositAmount) || numericDepositAmount <= 0);
        
    return numericDepositAmount;
        
};


//Il giocatore sceglierà il numero di linee sulle quali vuole scommettere 
const getNumberOfLines = () : number => {

    let lines: string;
    let numberOfLines : number; 

    do {
        lines = prompt('Number of lines to bet (1-3): ');
        numberOfLines = parseFloat(lines)
        
        if (isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3 ) {
            console.log("Invalid choice");
        } else {
            console.log(`Nice, you bet on ${numberOfLines} lines`);
        }
        
        
    } while (isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3);
        
    return numberOfLines;
        
};


//Decidi quanto vuoi scommettere per linea e controlli che hai abbastanza per scommettere sul numero di line scelte
const getBetAmount = (balance : number, lines : number) : number => {
    let betAmount: string;
    let numericBetAmount : number; 

    do {
        betAmount = prompt('Enter the bet per line: ');
        numericBetAmount = parseFloat( betAmount);
        
        if (isNaN(numericBetAmount) || numericBetAmount < 0 || numericBetAmount > balance / lines) {
            console.log("Invalid amount, tray again");
        } 
    } while (isNaN(numericBetAmount) || numericBetAmount < 0 || numericBetAmount > balance / lines);
  
    return numericBetAmount;

};


//Creei una tabella symbol che contiene tutti i simboli 
const spinReels = () : string[][] => {
    const symbols : string[] = [];
    //Object.entries(SYMBOLS_COUNT) restituisce un array contenente coppie [chiave, valore] di proprietà enumerabili di un oggetto.
    //Nel contesto di SYMBOLS_COUNT, restituisce un array del tipo [['A', 2], ['B', 4], ['C', 6], ['D', 8]].
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) { 
        	for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }         
    }
    //Crea un martice reels che al primo ciclo for crea una seconda taballe dentro reels e crea un clone di symbols chiamato reelSymbols
    const reels : string[][] = [];

    for (let i = 0; i < NUMBER_OF_COL; i++){
        reels.push([]);
        const reelSymbols : string[] = [...symbols];
        //Al secondo ciclo prende un simboilo random da reelSymbols lo mette nella nuova tabella dentro reels e lo elimina da reelSymbols 
        for (let j = 0; j < NUMBER_OF_ROWS; j++){
            const randomIndex : number = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol : string = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

//Matrice trasposta, si usa per scambiare colonne e righe
const transposeMatrix = (reels : string[][] ) : string[][] => {
    const rows : string [][] = []

    for (let i : number = 0; i < NUMBER_OF_ROWS; i++){
        rows.push([]);
        for (let j : number = 0; j < NUMBER_OF_COL; j++) {
            rows[i].push(reels[j][i]);
            
        }
    }
    return rows;
};

//Serve a printare in stile slot machine la matrice 
const printSlotMachine = (rows : string [][]) => {
    for (const row of rows){
        let rowString = "";
        //entries() è un metodo di array che restituisce un nuovo oggetto che contiene coppie chiave/valore per ogni indice 
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i !== rows.length){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }  
};


//Serve per controllere se hai vinto o perso, e in basde a quello calcola la vittoria o addebita la perdita dal tuo saldo iniziale
const getWinnings = (rows : string [][], bet : number, lines : number) : number => {
    let winnings : number = 0

    for (let row = 0; row < lines; row++){
        const symbols = rows[row]
        let allSame : boolean= true 

        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }
        if (allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }
    return winnings;
};


//Funzione Game, racchiude tutte le funzione precedenti e costruisce il gioco
const game = ( ) => {

    let balance : number = depositMoney();

    while (true) {
        console.log(`You have a balnce of €${balance}`)
        const numberOfBettingLines : number = getNumberOfLines();  
        const betAmount : number = getBetAmount(balance, numberOfBettingLines);   
        balance-= betAmount * numberOfBettingLines;
        const spinResult = spinReels(); 
        const transposedRows : string[][] = transposeMatrix(spinResult);   
        printSlotMachine(transposedRows);
        const winningsAmount : number = getWinnings(transposedRows, betAmount, numberOfBettingLines); 
        balance += winningsAmount;
        console.log(`You won, €${winningsAmount}`);

        //Il gioco finisce se finisci i soldi
        if (balance <= 0){
            console.log("GameOver, You run out of money");
            break;
        }

        let playAgain : string = ""

        //Ad ogni giro ti chiede se vuoi giocarer ancora
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


