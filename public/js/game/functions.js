
// change color on board
function playGamePiece(color, row, col) {
    board[col][row] = color;
}

// draw gameboard
function drawGameBoard() {
    // Draws by adding appropriate color classes where needed
    for (var c = 0; c <= 5; c++) {
        for (var r = 0; r <= 6; r++) {
            if (board[c][r] !== 0) {
                var cell = $("tr:eq(" + c + ")").find('td').eq(r);
                cell.children('button').addClass(board[c][r]);
            }
        }
    }
}

function dropToBottom(row, col) {
    // Start at the bottom of the column, and step up, checking to make sure
    // each position has been filled. If one hasn't, return the empty position.
    for (var c = 5; c > col; c--) {
        if (board[c][row] === 0) {
            return c;
        }
    }

    return col;
}

// Checks to see if a non-empty position is clicked.
// - This is necessary to ensure a player cannot override opponent's play(s).
function gamePieceClicked(row, col) {
    var value = board[col][row];

    return value === 0 ? false : true;
}

/*---------------------- Game Ending Conditions---------------------------------- */
/* Inspirations: http://bryanbraun.github.io/connect-four/*/
function gameIsDraw() {
    for (var c = 0; c <= 5; c++) {
        for (var r = 0; r <= 6; r++) {
            if (board[c][r] === 0) {
                return false;
            }
        }
    }

    // No locations were empty. Return true to indicate that the game is a draw.
    return true;
}

function horizontalWin() {
    var currentValue = null,
        previousValue = 0,
        tally = 0;

    // Scan each row in series, tallying the length of each series. If a series
    // ever reaches four, return true for a win.
    for (var c = 0; c <= 5; c++) {
        for (var r = 0; r <= 6; r++) {
            currentValue = board[c][r];
            if (currentValue === previousValue && currentValue !== 0) {
                tally += 1;
            } else {
                // Reset the tally if you find a gap.
                tally = 0;
            }
            if (tally === config.countToWin - 1) {
                return true;
            }
            previousValue = currentValue;
        }

        // After each row, reset the tally and previous value.
        tally = 0;
        previousValue = 0;
    }

    // No horizontal win was found.
    return false;
}

function verticalWin() {
    var currentValue = null,
        previousValue = 0,
        tally = 0;

    // Scan each column in series, tallying the length of each series. If a
    // series ever reaches four, return true for a win.
    for (var r = 0; r <= 6; r++) {
        for (var c = 0; c <= 5; c++) {
            currentValue = board[c][r];
            if (currentValue === previousValue && currentValue !== 0) {
                tally += 1;
            } else {
                // Reset the tally if you find a gap.
                tally = 0;
            }
            if (tally === config.countToWin - 1) {
                return true;
            }
            previousValue = currentValue;
        }

        // After each column, reset the tally and previous value.
        tally = 0;
        previousValue = 0;
    }

    // No vertical win was found.
    return false;
}

function diagonalWin() {
    var r = null,
        c = null,
        r_temp = null,
        c_temp = null,
        currentValue = null,
        previousValue = 0,
        tally = 0;

    // Test for down-right diagonals across the top.
    for (r = 0; r <= 6; r++) {
        r_temp = r;
        c_temp = 0;

        while (r_temp <= 6 && c_temp <= 5) {
            currentValue = board[c_temp][r_temp];
            if (currentValue === previousValue && currentValue !== 0) {
                tally += 1;
            } else {
                // Reset the tally if you find a gap.
                tally = 0;
            }
            if (tally === config.countToWin - 1) {
                return true;
            }
            previousValue = currentValue;

            // Shift down-right one diagonal index.
            r_temp++;
            c_temp++;
        }
        // Reset the tally and previous value when changing diagonals.
        tally = 0;
        previousValue = 0;
    }

    // Test for down-left diagonals across the top.
    for (r = 0; r <= 6; r++) {
        r_temp = r;
        c_temp = 0;

        while (0 <= r_temp && c_temp <= 5) {
            currentValue = board[c_temp][r_temp];
            if (currentValue === previousValue && currentValue !== 0) {
                tally += 1;
            } else {
                // Reset the tally if you find a gap.
                tally = 0;
            }
            if (tally === config.countToWin - 1) {
                return true;
            }
            previousValue = currentValue;

            // Shift down-left one diagonal index.
            r_temp--;
            c_temp++;
        }
        // Reset the tally and previous value when changing diagonals.
        tally = 0;
        previousValue = 0;
    }

    // Test for down-right diagonals down the left side.
    for (c = 0; c <= 5; c++) {
        r_temp = 0;
        c_temp = c;

        while (r_temp <= 6 && c_temp <= 5) {
            currentValue = board[c_temp][r_temp];
            if (currentValue === previousValue && currentValue !== 0) {
                tally += 1;
            } else {
                // Reset the tally if you find a gap.
                tally = 0;
            }
            if (tally === config.countToWin - 1) {
                return true;
            }
            previousValue = currentValue;

            // Shift down-right one diagonal index.
            r_temp++;
            c_temp++;
        }
        // Reset the tally and previous value when changing diagonals.
        tally = 0;
        previousValue = 0;
    }

    // Test for down-left diagonals down the right side.
    for (c = 0; c <= 5; c++) {
        r_temp = 6;
        c_temp = c;

        while (0 <= r_temp && c_temp <= 5) {
            currentValue = board[c_temp][r_temp];
            if (currentValue === previousValue && currentValue !== 0) {
                tally += 1;
            } else {
                // Reset the tally if you find a gap.
                tally = 0;
            }
            if (tally === config.countToWin - 1) {
                return true;
            }
            previousValue = currentValue;

            // Shift down-left one diagonal index.
            r_temp--;
            c_temp++;
        }
        // Reset the tally and previous value when changing diagonals.
        tally = 0;
        previousValue = 0;
    }

    // No diagonal wins found. Return false.
    return false;
}
