var _ = require('lodash');
var State = require('./state');
var Player = require('./game_objects/player');
var constants = require('./public/shared/gj_constants');

function Game() {
    this.player_colors = _.values(constants.player_colors);
    this.state = new State();
}

Game.prototype.addPlayer = function(id) {
    var color = this.player_colors.shift();
    if (color) {
        this.state.addObject(new Player(id, color));
    }
    return !!color;
};

Game.prototype.removePlayer = function(id) {
    var player = this.state.getObjectById(id);
    if (player) {
        this.player_colors.push(player.color);
        this.state.removeObject(player);
    }
};

Game.prototype.handleInput = function(id, input) {
    var object = _.find(this.state.objects, function(object) {
        return object.id == id;
    });
    if (object && object.handleInput) object.handleInput(input);
};

Game.prototype.step = function() {
    var self = this;

    this.state.step();

    _.each(this.state.objects, function(object) {
        object.update && object.update(self.state)
    });

    for (var i = 0; i < this.state.objects.length - 1; ++i) {
        for (var j = i + 1; j < this.state.objects.length; ++j) {
            _checkOverlapAndCollide(this.state.objects[i], this.state.objects[j], this.state);
        }
    }

    this.state.objects = _.filter(this.state.objects, function(object) {
        return object.alive;
    });
};

function _checkOverlapAndCollide(obj0, obj1, state) {
    if (Math.abs(obj0.x - obj1.x) > (obj0.w + obj1.w) / 2) return;
    if (obj0.y - obj0.h > obj1.y) return;
    if (obj1.y - obj1.h > obj0.y) return;
    obj0.collideWithObject && obj0.collideWithObject(obj1, state);
    obj1.collideWithObject && obj1.collideWithObject(obj0, state);
}

module.exports = Game;
