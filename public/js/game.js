var socket = io(); 
var gameID;
var username;
var playerid;  
var playerno;

$(document).ready(function() {

    gameID    = $("#gameID").val();
    username  = $("#username").val();
    playerid  = $("#playerid").val();
    playerno  = $("#playerno").val();

    //initial state
    if (playerno == '2') {
      $('.board button').prop("disabled",true);  
    }
     
    $('.prefix').text(config.playerPrefix);
    $('#player').addClass(currentPlayer).text(config[currentPlayer + "PlayerName"]);

    // Trigger the game sequence by clicking on a position button on the board.
    $('.board button').click(function(e) {
        // Detect the x and y position of the button clicked.
        var y_pos = $('.board tr').index($(this).closest('tr'));
        var x_pos = $(this).closest('tr').find('td').index($(this).closest('td'));

        // Ensure the piece falls to the bottom of the column.
        y_pos = dropToBottom(x_pos, y_pos);

        if (positionIsTaken(x_pos, y_pos)) {
            alert(config.takenMsg);
            return;
        }

        addDiscToBoard(currentPlayer, x_pos, y_pos);
        printBoard();

        $('.board button').prop("disabled",true);
        socket.emit('playGame', {gameID:gameID, playerno:playerno, x_pos:x_pos, y_pos:y_pos });

        // Check to see if we have a winner.
        if (verticalWin() || horizontalWin() || diagonalWin()) {
            // Destroy our click listener to prevent further play.
            $('.board button').unbind('click');
            $('.prefix').text(config.winPrefix);
            //$('.play-again').show("slow");
            return;

        } else if (gameIsDraw()) {
            // Destroy our click listener to prevent further play.
            $('.board button').unbind('click');
            $('.message').text(config.drawMsg);
            //$('.play-again').show("slow");
            return;
        }

        changePlayer(x_pos, y_pos);
    });

    /*$('.play-again').click(function(e) {
        location.reload();
    });*/

});

socket.on('onReceivedGame', function(d){

    if (gameID !== d.gameID) {
      return;
    }
    if (playerno === d.playerno) {
      return;
    }

    x_pos = d.x_pos;
    y_pos = d.y_pos;

    addDiscToBoard(currentPlayer, x_pos, y_pos);
    printBoard();

    // Check to see if we have a winner.
    if (verticalWin() || horizontalWin() || diagonalWin()) {
        // Destroy our click listener to prevent further play.
        $('.board button').unbind('click');
        $('.prefix').text(config.winPrefix);
        //$('.play-again').show("slow");
        return;

    } else if (gameIsDraw()) {
        // Destroy our click listener to prevent further play.
        $('.board button').unbind('click');
        $('.message').text(config.drawMsg);
        //$('.play-again').show("slow");
        return;
    }

    // Change the value of our player variable.
    if (currentPlayer === 'black') {
        currentPlayer = 'red';
    } else {
        currentPlayer = 'black';
    }

    // Update the UI.
    $('#player').removeClass().addClass(currentPlayer).text(config[currentPlayer + "PlayerName"]);

    $('.board button').prop("disabled", false);

});
/**
 * A function for changing players at the end of a turn.
 */
function changePlayer(x, y) {
    // Change the value of our player variable.
    if (currentPlayer === 'black') {
        currentPlayer = 'red';
    } else {
        currentPlayer = 'black';
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
