var _ = require('lodash');
var State = require('./state');
var Player = require('./game_objects/player');

function Game() {
    this.state = new State();
}

Game.prototype.addPlayer = function(id) {
    this.state.addObject(new Player(id));
};

Game.prototype.removePlayer = function(id) {
    this.state.removeObjectById(id);
};

Game.prototype.handleInput = function(id, msgInput) {
    // todo lol
};

Game.prototype.step = function() {
    var state = this.state.getState();
    _.each(state.objects, function(object) {
        object.update && object.update(state)
    });
};

module.exports = Game;
