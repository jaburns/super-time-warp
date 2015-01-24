var _ = require('lodash');
var constants = require('../public/shared/gj_constants');
var GameObject = require('./game_object');

var MAX_VELOCITY = 1234;
var DELTA_VELOCITY = 1234

var GRAVITY = 0.5;

var Player = function(id) {

    Player.superclass.call(this, id);

    this.type = 'player';
    this.x = 160*Math.random();
    this.y = 160*Math.random();
    this.w = 10;
    this.h = 20;

    this._keysDown = {};
    this._standing = 0; // When greater than zero, the player is on the ground.  Counts down every frame. Reset every time a ground collision is detected.
};

Player.superclass = GameObject;

_.extend(
    Player.prototype,
    GameObject.prototype,
    {
        update: function(state) {

            if (this._keysDown[constants.keys.LEFT_ARROW]) {
                this.vx += (-5 - this.vx) / 5;
            }
            else if (this._keysDown[constants.keys.RIGHT_ARROW]) {
                this.vx += (5 - this.vx) / 5;
            }
            else {
                this.vx *= 0.9;
            }
            if (this._standing > 0) {
                if (this._keysDown[constants.keys.SPACEBAR]) {
                    this._standing = 0;
                    this.vy = -10;
                } else {
                    this._standing--;
                }
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
                this.y = constants.TILE_SIZE * Math.floor(this.y / constants.TILE_SIZE);
                this.vy = 0;
                this._standing = 2;
            }
            if (map.sampleAtPixel(this.x,this.y-constants.TILE_SIZE)) {
                this.y = constants.TILE_SIZE * Math.ceil(this.y / constants.TILE_SIZE);
                if (this.vy < 0) this.vy = 0;
            }
            if (map.sampleAtPixel(this.x-constants.TILE_SIZE/2,this.y-constants.TILE_SIZE/2)) {
                this.x = constants.TILE_SIZE/2 + constants.TILE_SIZE * Math.floor(this.x / constants.TILE_SIZE);
                this.vx = 0;
            }
            if (map.sampleAtPixel(this.x+constants.TILE_SIZE/2,this.y-constants.TILE_SIZE/2)) {
                this.x = constants.TILE_SIZE/2 + constants.TILE_SIZE * Math.floor(this.x / constants.TILE_SIZE);
                this.vx = 0;
            }
        }
    }
);

module.exports = Player;
