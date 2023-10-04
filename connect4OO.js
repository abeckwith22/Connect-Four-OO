/* Connect Four Object Oriented Ver. */
// Part One: Make Game into a class

class Game {
    constructor(p1, p2) { // assuming contructor takes two players with different color properties
        self = this; // sets the scope for the my class
        self.player1 = new Player(p1);
        self.player2 = new Player(p2);
        self.currPlayer = 1;
        self.WIDTH = 7;
        self.HEIGHT = 6;
        self.board = [];
        self.isGameOver = false;

        self.makeBoard();
        self.makeHtmlBoard();

    }
    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */

    makeBoard() {
        for (let y = 0; y < self.HEIGHT; y++) {
            self.board.push(Array.from({ length: self.WIDTH }));
        }
    }

    /** makeHtmlBoard: make HTML table and row of column tops. */

    makeHtmlBoard() {
        const board = document.getElementById('board');

        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        top.addEventListener('click', self.handleClick);

        for (let x = 0; x < self.WIDTH; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }

        board.append(top);

        // make main part of board
        for (let y = 0; y < self.HEIGHT; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < self.WIDTH; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);
        }
    }

    /** findSpotForCol: given column x, return top empty y (null if filled) */

    findSpotForCol(x) {
        for (let y = self.HEIGHT - 1; y >= 0; y--) {
            if (!self.board[y][x]) {
                return y;
            }
        }
        return null;
    }

    /** placeInTable: update DOM to place piece into HTML table of board */

    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add(`p${self.currPlayer}`);
        piece.style.top = -50 * (y + 2);

        if (self.currPlayer === 1){
            piece.style.backgroundColor = self.player1.colorName;
        }
        else {
            piece.style.backgroundColor = self.player2.colorName;
        }

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    /** endGame: announce game end */

    endGame(msg) {
        alert(msg);
        self.isGameOver = true;
        document.querySelector('#column-top').removeEventListener('click', self.handleClick);
    }

    /** handleClick: handle click of column top to play piece */

    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;

        // get next spot in column (if none, ignore click)
        const y = self.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // place piece in board and add to HTML table
        self.board[y][x] = self.currPlayer;
        self.placeInTable(y, x);

        // check for win
        if (self.checkForWin()) {
            return self.endGame(`Player ${self.currPlayer} won!`);
        }

        // check for tie
        if (self.board.every(row => row.every(cell => cell))) {
            return endGame('Tie!');
        }

        // switch players
        self.currPlayer = self.currPlayer === 1 ? 2 : 1;
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */

    checkForWin() {
        const _win = (cells) => {
            // Check four cells to see if they're all color of current player
            //  - cells: list of four (y, x) cells
            //  - returns true if all are legal coordinates & all match currPlayer

            return cells.every(
                ([y, x]) =>
                    y >= 0 &&
                    y < self.HEIGHT &&
                    x >= 0 &&
                    x < self.WIDTH &&
                    self.board[y][x] === self.currPlayer
            );
        }

        for (let y = 0; y < self.HEIGHT; y++) {
            for (let x = 0; x < self.WIDTH; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
}

class Player {
    constructor(colorName){
        this.colorName = colorName;
    }

    getColorName(){
        return this.colorName;
    }
}

const startButton = document.querySelector('#startGame');
let start = 0;

startButton.addEventListener('click', (event) => {
    event.preventDefault();
    let connect4Game;
    if (start === 0){ // Just so that they can't create a new instance
        start = 1;

        const player1 = document.querySelector('#p1Color').value;
        const player2 = document.querySelector('#p2Color').value;
        connect4Game = new Game(player1, player2);
    }
});