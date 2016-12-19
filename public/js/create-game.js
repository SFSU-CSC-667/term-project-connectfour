var socket = io(); 
var gameid;
var playerid;
var opponent;

socket.on('createdGame', function(d){
  gameid = d.game_id;  
});
 
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

    $("#create_game").click(function() {
                
        var data = {
            game_name: $('#game_name').val(),
            playerid: $('#playerid').val(),
            username: $('#username').val(),
            opponent: null
        };

        playerid = $('#playerid').val();
        $("#game_name").prop("readonly", true);
        $("#create_game").prop("disabled", true);

        $("#system-msgs").append('<br><br>');
        $("#system-msgs").append('<li>Game Creation Success!</li>');
        $("#system-msgs").append('<li>Awaiting opponent..........');
        
        socket.emit('createGame', data);
    });

});
 
