var socket = io(); 
var gameid;

function updateTable() {
    $('#wait-games').load(window.location.href + " #wait-games" );
};

function onJoin(gameId, playerId) {

    gameid = gameId;
    var data = {
        gameid: gameId,
        playerid: playerId        
    };

    socket.emit('joinGame', data);
  
};

socket.on('joinedGame', function(d){
   
    if (d.status == 0) {
        return;
    }

    if (gameid == d.game_id) {
        //start game    
        $("#game_id").val(d.game_id);
        $("#joinForm").submit();  
    }
});

$(document).ready(function(){
    setInterval(function () {
        updateTable();
    }, 3000);

});

