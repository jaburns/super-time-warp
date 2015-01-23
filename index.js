
var _ = require('lodash');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(port, function(){
    console.log('listening on '+port);
});

// Setup socket.io to manage connections with clients ########################

var clients = [];

function Client(socket) {
    this.socket = socket;
    this.id = Math.random().toString().substr(2);

    socket.on('msg input', this.receiveInput);

    console.log('Client connected with ID: '+this.id);
}

Client.prototype.receiveInput = function(msgInput) {
    console.log('Received input "'+msgInput+'" from client '+this.id);
}

Client.prototype.dispose = function() {
    console.log('Client disconnected with ID: '+this.id);
}

io.on('connection',function(socket) {
    var client = new Client(socket);
    clients.push(client);
    socket.on('disconnect', function() {
        clients.splice(clients.indexOf(client), 1);
        client.dispose();
    });
});

// Update loop ###############################################################

setInterval(function() {
    var state = 'Some game state '+Math.random().toString().substr(2);
    _.each(clients,function(client) {
        client.socket.volatile.emit('msg state', state);
    });
},
    500
);
