var config = {
        yellowPlayerName: "Player 1",
        redPlayerName: "Player 2",
        startingPlayer: "yellow", // Choose 'yellow' or 'red'.
        takenMsg: "This position is already taken. Please make another choice.",
        drawMsg: "This game is a draw.",
        playerPrefix: "Current Player is: ",
        winPrefix: "The winner is: ",
        countToWin: 4,
    };

// Logical gameboard.
// 0: empty; yellow: yellow piece occupies; red: red piece occupies
var board = [[0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0]];

//initialize first turn
var currentPlayer = config.startingPlayer;