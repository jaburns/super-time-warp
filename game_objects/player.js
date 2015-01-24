var _ = require('lodash');
var constants = require('../public/shared/gj_constants');
var GameObject = require('./game_object');

var MAX_VELOCITY = 1234;
var DELTA_VELOCITY = 1234

var GRAVITY = 0.05;

var Player = function(id) {

    Player.superclass.call(this, id);

    this.type = 'player';
    this.x = 160*Math.random();
    this.y = 160*Math.random();
    this.w = 10;
    this.h = 20;

};

Player.superclass = GameObject;

_.extend(
    Player.prototype,
    GameObject.prototype,
    {
        update: function(state) {

            this.vy += GRAVITY;
            Player.superclass.prototype.update.call(this, state);

        },
        handleInput: function(input) {

            if (input.type == 'key') {
                switch (input) {
                    case constants.keys.SPACEBAR:
                        break;
                    case constants.keys.LEFT_ARROW:
                        break;
                    case constants.keys.UP_ARROW:
                        break;
                    case constants.keys.RIGHT_ARROW:
                        break;
                    case constants.keys.DOWN_ARROW:
                        break;
                }
            } else if (input.type == 'mouse') {

                var x = this.x;
                var y = this.y;
                var mx = input.x;
                var my = input.y;

                this.angle = Math.tan(Math.abs(x - mx) / Math.abs(y - my));

            }


        }
    }
);

module.exports = Player;
