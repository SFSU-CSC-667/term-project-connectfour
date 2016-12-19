var socket = io(); 
var gameID;
var username;
//var opponent;
var playerid;  
var playerno;

$(document).ready(function() {

    gameID    = $("#gameID").val();
    username  = $("#username").val();
    //opponent  = $("#opponent").val();
    playerid  = $("#playerid").val();
    playerno  = $("#playerno").val();

    //initial state
    if (playerno == '2') {
      $('.board button').prop("disabled",true);
      //config.redPlayerName = username;
      $('.colorMsg').addClass("red").text("You're the Red game piece");
    } else {
      //config['yellowPlayerName'] = username;
      $('.colorMsg').addClass("yellow").text("You're the Yellow game piece")
    }
    
    $('.prefix').text(config.playerPrefix);
    $('#player').addClass(currentPlayer).text(config[currentPlayer + "PlayerName"]);

    // Trigger the game sequence by clicking on a position button on the board.
    $('.board button').click(function(e) {
        // Determine clicked position
        var col = $('.board tr').index($(this).closest('tr'));
        var row = $(this).closest('tr').find('td').index($(this).closest('td'));

        // Drop piece to the bottom
        col = dropToBottom(row, col);

        if (gamePieceClicked(row, col)) {
            alert(config.takenMsg);
            return;
        }

        playGamePiece(currentPlayer, row, col);
        drawGameBoard();

        $('.board button').prop("disabled",true);
        socket.emit('playGame', {gameID:gameID, playerno:playerno, row:row, col:col });

        // Check game ending conditions
        if (verticalWin() || horizontalWin() || diagonalWin()) {
            // Disable game board
            $('.board button').unbind('click');
            $('.colorMsg').text("You Win!");
            $('.prefix').text(config.winPrefix);
            return;

        } else if (gameIsDraw()) {
            // Disable game board
            $('.board button').unbind('click');
            $('.colorMsg').text("Draw!");
            $('.message').text(config.drawMsg);
            return;
        }

        changePlayer(row, col);
    });
});

socket.on('onReceivedGame', function(d){

    if (gameID !== d.gameID) {
      return;
    }
    if (playerno === d.playerno) {
      return;
    }

    row = d.row;
    col = d.col;

    playGamePiece(currentPlayer, row, col);
    drawGameBoard();

    // Check to see if we have a winner.
    if (verticalWin() || horizontalWin() || diagonalWin()) {
        // Destroy our click listener to prevent further play.
        $('.board button').unbind('click');
        $('.colorMsg').text("You Lose...");
        $('.prefix').text(config.winPrefix);
        return;

    } else if (gameIsDraw()) {
        // Destroy our click listener to prevent further play.
        $('.board button').unbind('click');
        $('.colorMsg').text("Draw!");
        $('.message').text(config.drawMsg);
        return;
    }

    // Change the value of our player variable.
    if (currentPlayer === 'yellow') {
        currentPlayer = 'red';
    } else {
        currentPlayer = 'yellow';
    }

    // Update the UI.
    $('#player').removeClass().addClass(currentPlayer).text(config[currentPlayer + "PlayerName"]);

    $('.board button').prop("disabled", false);

});

function changePlayer(r, c) {
    // Change the value of our player variable.
    if (currentPlayer === 'yellow') {
        currentPlayer = 'red';
    } else {
        currentPlayer = 'yellow';
    }

    // Update the UI.
    $('#player').removeClass().addClass(currentPlayer).text(config[currentPlayer + "PlayerName"]);
       
}


/*-------------------------  game chat -------------------------*/
function submitfunction(){
  var from = $('#user').val();
  var message = $('#m').val();
  if(message != '') {
    socket.emit('gamechatMessage', from, message, gameID);
  }

  $('#m').val('').focus();
  return false;
}
 
function notifyTyping() { 
  var user = $('#user').val();
  socket.emit('gamenotifyUser', user, gameID);
}
 

socket.on('gamechatMessage', function(from, msg, gID){
  if (gameID !== gID) {
    return;
  }

  var me = $('#user').val();
  var color = (from == me) ? 'green' : '#009afd';
  var from = (from == me) ? 'Me' : from;
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
});
 
socket.on('gamenotifyUser', function(user, gID){
  if (gameID !== gID) {
    return;
  }

  var me = $('#user').val();
  if (user != me) {
    $('#notifyUser').text(user + ' is typing ...');
  }
  setTimeout(function(){ $('#notifyUser').text(''); }, 10000);
});
