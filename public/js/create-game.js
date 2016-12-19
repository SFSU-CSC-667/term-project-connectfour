var socket = io(); 
var gameid;
var playerid;

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
            username: $('#username').val()
        };

        playerid = $('#playerid').val();
        
        socket.emit('createGame', data);
    });	

});
 
