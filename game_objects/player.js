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

    this._keysDown = {};
};

Player.superclass = GameObject;

_.extend(
    Player.prototype,
    GameObject.prototype,
    {
        update: function(state) {

            // Integrate acceleration in to velocity.
            if (this._keysDown[constants.keys.LEFT_ARROW]) {
                this.vx = -2;
            }
            else if (this._keysDown[constants.keys.RIGHT_ARROW]) {
                this.vx = 2;
            }
            else {
                this.vx = 0;
            }
            this.vy += GRAVITY;

            // Integrate velocity in to position.
            Player.superclass.prototype.update.call(this, state);

            // Collide with the map.
            this.collideWithMap (state.maps[state.era]);
        },

        handleInput: function(input) {
            if (input.type == 'keydown') {
                this._keysDown[input.key] = true;
            } else if (input.type == 'keyup') {
                delete this._keysDown[input.key];
            }
        },

        collideWithMap: function(map) {
            if (map.sampleAtPixel(this.x,this.y)) {
                this.vy = -1;
            }
        }
    }
);

module.exports = Player;
