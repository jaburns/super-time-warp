var _ = require('lodash');
var State = require('./state');
var Player = require('./game_objects/player');
var constants = require('./public/shared/gj_constants');

var ERA_FRAMECOUNT_MIN = 60;
var ERA_FRAMECOUNT_MAX = 90;

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

    if (--this.state.countDownToNextEra <= 0) {
        this.state.countDownToNextEra = ERA_FRAMECOUNT_MIN + (ERA_FRAMECOUNT_MAX-ERA_FRAMECOUNT_MIN)*Math.random();

        var self = this;
        this.state.era = _.chain(constants.eras)
            .filter(function(era) { return era !== self.state.era; })
            .sample()
            .value();
    }

    _.each(this.state.objects, function(object) {
        object.update && object.update(self.state)
    });

    for (var i = 0; i < this.state.objects.length-1; ++i) {
        for (var j = i+1; j < this.state.objects.length; ++j) {
            _checkOverlapAndCollide (this.state.objects[i], this.state.objects[j]);
        }
    }

    this.state.objects = _.filter(this.state.objects, function(object) {
        return object.alive;
    });
};

function _checkOverlapAndCollide(obj0, obj1) {
    if (Math.abs(obj0.x-obj1.x) > (obj0.w+obj1.w)/2) return;
    if (obj0.y-obj0.h > obj1.y) return;
    if (obj1.y-obj1.h > obj0.y) return;
    obj0.collideWithObject && obj0.collideWithObject(obj1);
    obj1.collideWithObject && obj1.collideWithObject(obj0);
}

module.exports = Game;
