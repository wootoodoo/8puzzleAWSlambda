/*
Solver algorithm using Djikstra's algorithm and a minPQ data structure.
Solver = {
    solver(array): take in an Array and computes the number of steps sorting
                new neighbors by manhattan count
    history: A stack of arrays leading to the solution
}
*/

module.exports = function(array) {
    const Board = require(__dirname + "/board.js");
    const PriorityQueue = require('javascript-priority-queue');

    // if (array == null) throw "cannot enter a null array";

    let isSolvable = true;
    let solutionHistory = [];
    let numSteps = 0;

    //Set up the initial minPQ and history stack. Priority is based on number of
    // moves to get to that position plus the manhattan count of that board.
    const minPQ = new PriorityQueue.default('min');
    let firstBoard = new Board(array, null, 0);
    let history = new Array(firstBoard);
    minPQ.enqueue(firstBoard, firstBoard.manhattanCount + firstBoard.numMoves);

    // Set up the twinPQ
    const twinPQ = new PriorityQueue.default('min');
    let twinBoard = new Board(firstBoard.getTwin(), null, 0);
    twinPQ.enqueue(twinBoard, twinBoard.manhattanCount + twinBoard.numMoves);

    // iterate while hamming count != 0, by popping out the minPQ
    // and adding the neighbors to the minPQ

    while (minPQ.peek().hammingCount) {
        // Get neighbours and add the neighbours to the minPQ
        let minBoard = minPQ.dequeue();
        let moves = minBoard.numMoves;
        let prevArray = minBoard.prevArray;

        let minNeighbors = minBoard.neighbors();
        let sizeNeighborsStack = minNeighbors.length;
        for (let i = 0; i < sizeNeighborsStack; i++) {
            // Ensure that the previous configuration is not added to PQ 
            let neighborBoard = new Board(minNeighbors.pop(), minBoard.getArray, moves + 1);
            if (!neighborBoard.equals(prevArray)) {
                minPQ.enqueue(neighborBoard, neighborBoard.manhattanCount + neighborBoard.numMoves);
            }
        }
        if (moves > 0) history.push(minBoard);
        // Apart from the first board, push it onto the history stack

        // Repeat for the twin, and the original board is unsolvable if twin has a solution
        let minTwin = twinPQ.dequeue();
        let movesTwin = minTwin.numMoves;
        let prevTwin = minTwin.prevArray;
        let twinNeighbors = minTwin.neighbors();
        let sizeTwinNeighborsStack = twinNeighbors.length;
        for (let i = 0; i < sizeTwinNeighborsStack; i++) {
            let neighborBoard = new Board(twinNeighbors.pop(), minTwin.getArray, movesTwin + 1);
            // Check if the twin's neighbors have reached the goal
            if (!neighborBoard.hammingCount) {
                isSolvable = false;
                break;
            }
            if(!neighborBoard.equals(prevTwin)) {
                twinPQ.enqueue(neighborBoard, neighborBoard.manhattanCount + neighborBoard.numMoves);
            }
        }

        // Break from the while loop if the solution is unsolvable
        if (!isSolvable) break;
    }

    if (isSolvable) {
        console.log("8 puzzle: Found a solution, computing the history stack")
        let lastBoard = minPQ.dequeue();
        history.push(lastBoard);
        numSteps = lastBoard.numMoves;

        /** Insert code to find output the solution */
        let numberMoves = numSteps;
        let prevBoard = history.pop();
        solutionHistory.push(prevBoard.getArray);
        let length = history.length;
        for (let i = length - 1; i >= 0; i--) {
            let nextBoard = history[i];
            let isNeighbor = false;
            // Check that the nextBoard is a neighbor of the previous board
            prevBoard.neighbors().forEach(function(neighbor) {
                if (nextBoard.equals(neighbor)) isNeighbor = true;
            });
            if (isNeighbor && nextBoard.numMoves == numberMoves - 1) {
                solutionHistory.push(nextBoard.getArray);
                prevBoard = nextBoard;
                numberMoves--;
            }
        }

    }
    else {
        solutionHistory.push(array);
        numSteps = -1;
    }

    this.history = solutionHistory;
    this.numSteps = numSteps;

}