var _ = require('lodash');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var Game = require('./game');
var Player = require('./game_objects/player.js');
var gj_CONSTANTS = require('./public/shared/gj_constants.js');
var gj_JSON = require('./public/shared/gj_json.js');

function lawg (msg) {
    console.log ((new Date).toString() + ' -- ' + msg);
}

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(port, function() {
    lawg('listening on ' + port);
});

// Setup socket.io to manage connections with clients ########################

var game = new Game();
var oldState = {};
var clients = [];
var gameRunning = false;
var gameInterval = -1;
var someClientJustDied = false;


function Client(socket) {
    this.socket = socket;
    this.alive = true;
    if (game.addPlayer(this.socket.id)) {
        socket.on('msg input', this.receiveInput.bind(this));
    } else {
        socket.emit('msg full');
    }
    socket.emit('msg state', game.state.getState());
}

Client.prototype.receiveInput = function(input) {
    game.handleInput(this.socket.id, input);
};

Client.prototype.dispose = function() {
    lawg('Client disconnected with ID: ' + this.socket.id);
    game.removePlayer(this.socket.id);
    someClientJustDied = true;
    this.alive = false;
};

io.on('connection', function(socket) {
    var client = new Client(socket);
    clients.push(client);
    socket.on('disconnect', client.dispose.bind(client));
    setGameRunning (true);
    lawg('Client connected with ID: ' + this.socket.id);
});

function setGameRunning(running) {
    if (gameRunning === running) return;
    gameRunning = running;
    if (gameRunning) {
        lawg ("STARTING GAME SESSION");
        gameInterval = setInterval (mainLoop, gj_CONSTANTS.DELTA_TIME);
    } else {
        lawg ("ENDING GAME SESSION");
        clearInterval (gameInterval);
    }
}

function mainLoop() {
    game.step();

    var newState = prune(_.cloneDeep(game.state.getState()));
    var diff = gj_JSON.diff(oldState, newState);
    oldState = newState;

    var state = 'Some game state ' + Math.random().toString().substr(2);
    _.each(clients, function(client) {
        client.socket.emit('msg diff', diff);
    });

    if (someClientJustDied) {
        clients = _.filter(clients, function(client) {
            return client.alive;
        });
        someClientJustDied = false;

        if (clients.length < 1) {
            setGameRunning (false);
        }
    }
}

function prune(object) {
    if (typeof(object) != 'object' || object === null) return object;
    var keys = Object.keys(object);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key[0] == '_') delete object[key];
        else if (Array.isArray(object[key])) object[key] = _.map(object[key], function(o) { return prune(o) });
        else if (typeof(object[key]) == 'object' && object[key] !== null) object[key] = prune(object[key]);
    }
    return object;
}
