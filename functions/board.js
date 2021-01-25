/*
Helper function to construct the boards, calculate the hamming and manhattan distances
and also to create a stack of the neighbours
Board(array, prevArray, numMoves) = {
    hammingCount: Number,
    manhattanCount: Number,
    getArray: n x n Array
    neighbors(): returns a stack of neighbor arrays
    numMoves: Number
    prevArray: array of the previous board
    equals(array): takes in an array and compares if the values are the same
    getTwin(): returns a Array of the twin (2 tiles are inverted)
}
*/

module.exports = function(array, prevArray, numMoves) {
    // Import the stack library from npm
    const _ = require('lodash');
    let n = array.length;
    let hammingCount = 0;
    let manhattanCount = 0;

    // Compute hammingcount and manhattan count
    for (let row = 0; row < n; row++){
        for (let col = 0; col < n; col++) {
            // hamming count is the number of tiles that are not in the correct
            if (array[row][col] != (row * n) + col + 1 && row * col != Math.pow(n - 1, 2)) {
                hammingCount += 1;
            }
            // manhattan count is the number of spaces away that a tile is out of place
            if (array[row][col] != (row * n) + col + 1 && array[row][col] != 0) {
                let actualRow = Math.floor((array[row][col] - 1) / n);
                let actualCol = array[row][col] - (actualRow * n) - 1;
                manhattanCount += Math.abs(row - actualRow);
                manhattanCount += Math.abs(col - actualCol);
            }
        }
    }
    this.hammingCount = hammingCount;
    this.manhattanCount = manhattanCount;
    this.getArray = array;
    this.numMoves = numMoves;
    this.prevArray = prevArray;

    this.neighbors = function () {
        let neighbours = new Array();
        let newBoard = new Array(n);
        let newBoard2 = new Array(n);
        let newBoard3 = new Array(n);
        let newBoard4 = new Array(n);

        // create 4 duplicates of the board
        for (let row = 0; row < n; row++) {
            newBoard[row] = new Array(n);
            newBoard2[row] = new Array(n);
            newBoard3[row] = new Array(n);
            newBoard4[row] = new Array(n);
            for (let col = 0; col < n; col++) {
                newBoard[row][col] = array[row][col];
                newBoard2[row][col] = array[row][col];
                newBoard3[row][col] = array[row][col];
                newBoard4[row][col] = array[row][col];
            }
        }
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (array[row][col] == 0) {
                    if (col < n - 1) {
                        newBoard[row][col] = newBoard[row][col + 1];
                        newBoard[row][col + 1] = 0;
                        neighbours.push(newBoard);
                    }
                    if (col > 0) {
                        newBoard2[row][col] = newBoard2[row][col - 1];
                        newBoard2[row][col - 1] = 0;
                        neighbours.push(newBoard2);
                    }
                    if (row < n - 1) {
                        newBoard3[row][col] = newBoard3[row + 1][col];
                        newBoard3[row + 1][col] = 0;
                        neighbours.push(newBoard3);
                    }
                    if (row > 0) {
                        newBoard4[row][col] = newBoard4[row - 1][col];
                        newBoard4[row - 1][col] = 0;
                        neighbours.push(newBoard4);
                    }
                    break;
                }
            }
        }
        return neighbours;
    }
    
    /* compare the array with another array to see if it is identical */

    this.equals = function (newArray) {
        if (!newArray) return false;
        if (n != newArray.length) return false;
        for (var row = 0; row < n; row++) {
            for (var col = 0; col < n; col++) {
                if (newArray[row][col] != array[row][col]) return false;
            }
        }
        return true;
    }

    /* Create the twin Array to detect for unsolvable puzzles */
    this.getTwin = function() {
        let row, col, row2, col2 = 0;
        let cont = true;
        while (cont) {
            row = Math.floor(Math.random() * n);
            col = Math.floor(Math.random() * n);
            row2 = Math.floor(Math.random() * n);
            col2 = Math.floor(Math.random() * n);
            if (array[row][col] != 0 && array[row2][col2] != 0 && (row != row2
                        || col2 != col)) {
                    cont = false;
                }
        }
        let twinArray = _.cloneDeep(array);
        twinArray[row][col] = array[row2][col2];
        twinArray[row2][col2] = array[row][col];
        return twinArray;
    }
}