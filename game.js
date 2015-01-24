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

Game.prototype.handleInput = function(id, input) {
    var object = _.find(this.state.objects, function(object) {
        return object.id == id;
    });
    if (object && object.handleInput) object.handleInput(input);
};

Game.prototype.step = function() {
    var self = this;

    _.each(this.state.objects, function(object) {
        object.update && object.update(self.state)
    });

    this.state.objects = _.filter(this.state.objects, function(object) {
        return object.alive;
    });

};

module.exports = Game;
