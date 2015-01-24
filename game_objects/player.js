var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var GameObject = require('./game_object');
var Projectile = require('./projectile');

var Player = function(id) {

    Player.superclass.call(this, id);

    this.type = 'player';
    this.x = 160 * Math.random();
    this.y = 160 * Math.random();
    this.w = 10;
    this.h = 20;
    this.d = 1;

    this._keysDown = {};
    this._mousePos = { x: null, y: null };
    this._mouseDown = false;
    this._standing = 0; // When greater than zero, the player is on the ground.  Counts down every frame. Reset every time a ground collision is detected.

    this._fireDelay = 500;
    this._lastFireTime;
};

Player.superclass = GameObject;

_.extend(
    Player.prototype,
    GameObject.prototype,
    {
        update: function(state) {

            if (this._keysDown[constants.keys.MOVE_LEFT]) {
                this.vx += (-5 - this.vx) / 5;
            } else if (this._keysDown[constants.keys.MOVE_RIGHT]) {
                this.vx += (5 - this.vx) / 5;
            } else {
                this.vx *= 0.9;
            }

            if (this.vx > 0) {
                this.d = 1;
            } else if (this.vx < 0) {
                this.d = -1;
            }

            if (this._standing > 0) {
                if (this._keysDown[constants.keys.JUMP]) {
                    this._standing = 0;
                    this.vy = -10;
                } else {
                    this._standing--;
                }
            }

            //this.angle = Math.atan2((this.y - this._mousePos.y), (this.x - this._mousePos.x));

            if (this._mouseDown) {
                if (this._lastFireTime && (new Date().getTime - this._lastFireTime) < this._fireDelay) return;
                this._lastFireTime = new Date().getTime();
                var bullet = new Projectile();

                bullet.x = this.x;
                bullet.y = this.y - (this.h / 2);

                bullet.angle = this.angle;
                bullet.vx = Math.cos(bullet.angle) * 10;
                bullet.vy = Math.sin(bullet.angle) * 10;

                state.addObject(bullet);

            }

            // Integrate velocity in to position.
            Player.superclass.prototype.update.call(this, state);

            // Collide with the map.
            this.collideWithMap(state.maps[state.era]);
        },

        handleInput: function(input) {
            switch (input.type) {
                case 'keydown':
                    this._keysDown[input.key] = true;
                    break;
                case 'keyup':
                    delete this._keysDown[input.key];
                    break;
                case 'mousemove':
                    this._mousePos.x = input.x;
                    this._mousePos.y = input.y;
                    break;
                case 'mousedown':
                    this._mouseDown = true;
                    break;
                case 'mouseup':
                    this._mouseDown = false;
                    break;
            }
        },

        collideWithMap: function(map) {
            if (map.sampleAtPixel(this.x, this.y)) {
                this.y = constants.TILE_SIZE * Math.floor(this.y / constants.TILE_SIZE);
                this.vy = 0;
                this._standing = 2;
            }
            if (map.sampleAtPixel(this.x, this.y - constants.TILE_SIZE)) {
                this.y = constants.TILE_SIZE * Math.ceil(this.y / constants.TILE_SIZE);
                if (this.vy < 0) this.vy = 0;
            }
            if (map.sampleAtPixel(this.x - constants.TILE_SIZE / 2, this.y - constants.TILE_SIZE / 2)) {
                this.x = constants.TILE_SIZE / 2 + constants.TILE_SIZE * Math.floor(this.x / constants.TILE_SIZE);
                this.vx = 0;
            }
            if (map.sampleAtPixel(this.x + constants.TILE_SIZE / 2, this.y - constants.TILE_SIZE / 2)) {
                this.x = constants.TILE_SIZE / 2 + constants.TILE_SIZE * Math.floor(this.x / constants.TILE_SIZE);
                this.vx = 0;
            }
        }
    }
);

module.exports = Player;
