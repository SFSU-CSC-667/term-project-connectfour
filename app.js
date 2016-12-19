var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var session = require('express-session')({
	secret: "my-secret",
	resave: true,
	saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

var express=require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(session);
io.use(sharedsession(session));


var conString = 'postgres://postgres:asdfgh@localhost:5432/connect4';
var sess;

// Initialize appication with route / (that means root of the application)
app.get('/', function(req, res){

	sess = req.session;
	if (sess.username)
	{
		pg.connect(conString, function(err, client, done) {
		    if (err) {
		      return console.error('error fetching client from pool', err);
		    }
		    console.log("connected to database");

		    client.query('SELECT * FROM games WHERE game_full = $1', [ false ], function(err, result) {
		      done();
		      if (err) {
		        return console.error('error running query', err);
		      }		      

			  res.render('index', {pageTitle: "Lobby", games:result.rows,  playerid: sess.playerId, username: sess.username});		    
		    });
		});
		//res.render('index', {username: sess.username});
	} else {
		res.redirect('/login');
	}
});

//get
app.get('/login', function(req, res){
	res.render('login', {pageTitle: "Log-In", error: ''});
});

app.get('/logout', function (req, res) {
    sess = req.session
    sess.destroy();
    res.redirect('login');
});
 
app.get('/register', function(req, res){	
	res.render('register', {pageTitle: "Register"});
});

app.get('/create-new-game', function(req, res){
	sess = req.session;
	if (sess.username) {
		res.render('create-new-game', {pageTitle: "Create Game", username: sess.username, playerid: sess.playerId});
	} else {
		res.redirect('/');
	}
});

app.get('/join-game', function(req, res){
	sess = req.session;
	if (sess.username) {

		pg.connect(conString, function(err, client, done) {
		    if (err) {
		      return console.error('error fetching client from pool', err);
		    }
		    console.log("connected to database");

		    client.query('SELECT * FROM games WHERE game_full = $1', [ false ], function(err, result) {
		      done();
		      if (err) {
		        return console.error('error running query', err);
		      }		      

			  res.render('join-game', {pageTitle: "Gameroom", games:result.rows,  playerid: sess.playerId, username: sess.username});		    
		    });

		});
		
	} else {
		res.redirect('/');
	}
});

//post
app.post('/login' , function(req, res) {
	pg.connect(conString, function(err, client, done) {
	    if (err) {
	      return console.error('error fetching client from pool', err);
	    }
	    console.log("connected to database");
	    client.query('SELECT * FROM players WHERE name = $1 and password = $2', [req.body.username, req.body.password], function(err, result) {
	      done();
	      if (err) {
	        return console.error('error running query', err);
	      }
	      

	      if (result.rows.length == 0) {

	      	res.render('login', {pageTitle: "Login", error: "Username or Password is not correct."
    		});
	      } else {
			sess = req.session;
			sess.username = req.body.username;
			sess.password = req.body.password;
			sess.playerId = result.rows[0].player_id;

			res.redirect('/');
	      }

	    });
	});
});

app.post('/register', function(req, res) {

	pg.connect(conString, function(err, client, done) {
	    if (err) {
	      return console.error('error fetching client from pool', err);
	    }
	    console.log("connected to database");

	    client.query('INSERT INTO players(name, email, password) VALUES($1, $2, $3) returning player_id', [req.body.username, req.body.email, req.body.password], function(err, result) {
	      done();
	      if (err) {
	        return console.error('error running query', err);
	      }
	      
	      res.redirect('/login');
	    });
	});

});

app.post('/game', function(req, res){
	sess = req.session;

	if (sess.username) {
		if (typeof req.body.game_id === "undefined") {
			res.redirect('/');
		}
	
		res.render('game', {pageTitle: "Gameroom", gameID: req.body.game_id, username: sess.username, playerid: sess.playerId, playerno: req.body.player_no});

	} else {
		res.redirect('/login');
	}
});



// Register events on socket connection
io.on('connection', function(socket){ 
  
  //chat 
  socket.on('chatMessage', function(from, msg){
    io.emit('chatMessage', from, msg);
  });

  socket.on('notifyUser', function(user){
    io.emit('notifyUser', user);
  });

  //game chat 
  socket.on('gamechatMessage', function(from, msg, gameID){
    io.emit('gamechatMessage', from, msg, gameID);
  });

  socket.on('gamenotifyUser', function(user, gameID){
    io.emit('gamenotifyUser', user, gameID);
  });

  /*---------------------------	create/join game  ----------------------------*/
  socket.on('createGame', function(data){

	pg.connect(conString, function(err, client, done) {
	    if (err) {
	      return console.error('error fetching client from pool', err);
	    }
	    console.log("connected to database");

	    client.query('INSERT INTO games(game_name, player1_id, game_full) VALUES($1, $2, $3) RETURNING game_id', [data.game_name, data.playerid, false], function(err, result) {
	      done();
	      if (err) {
	        return console.error('error running query', err);
	      }

	      socket.handshake.session.game_id 	  = result.rows[0].game_id;
	      socket.handshake.session.game_name  = data.game_name;
	      socket.handshake.session.player1_id = data.playerid;
		
		  io.emit('createdGame', {game_id: result.rows[0].game_id});      
	    });
	});	
	
  });

  socket.on('joinGame', function(data){
	
	pg.connect(conString, function(err, client, done) {
	    if (err) {
	      return console.error('error fetching client from pool', err);
	    }
	    console.log("connected to database");

 		client.query('SELECT * FROM games WHERE game_id = $1 and game_full = true', [data.gameid], function(err, result) {
	      done();
	      if (err) {
	        return console.error('error running query', err);
	      }
	      

	      if (result.rows.length == 0) {
			client.query('UPDATE games SET player2_id=($1), game_full=($2) WHERE game_id=($3)',
			    [data.playerid, true, data.gameid]);

		    io.emit('joinedGame', { game_id: data.gameid, status: 1 });      	      	
	      } else {
			io.emit('joinedGame', { status: 0 });      	      	
	      }

	    });		
	});	
  });  


  /*----------------------- game session ---------------------------*/

	socket.on('playGame', function(d){

 		io.emit('onReceivedGame', {gameID:d.gameID, playerno:d.playerno, row:d.row, col:d.col });

	});

	socket.on('disconnect', function() {
		console.log( socket.username + ' has disconnected from the chat.' + socket.id);
		
	})

});
 
//Listen application request on port 3000
http.listen(app.get('port'), function(){
  console.log('listening on ' +
  app.get('port'));
});
