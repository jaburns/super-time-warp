var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var GameObject = require('./game_object');
var Axe = require('./axe');
var Lazer = require('./lazer');

var GRAVITY = 0.5;

var Player = function(id, color) {

    Player.superclass.call(this, id);

    this.type = 'player';
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.w = 16;
    this.h = 16;
    this.d = 1;

    this.kills = 0;
    this.deaths = 0;

    this._spawnCountdown = 30;

    this._keysDown = {};
    this._prevKeysDown = {};
    this._mousePos = { x: null, y: null };
    this._mouseDown = false;
    this._standing = 0; // When greater than zero, the player is on the ground.  Counts down every frame. Reset every time a ground collision is detected.

    this._cachedMap = null;
    this._fireDelay = 500;
    this._lastFireTime = null;
};

Player.superclass = GameObject;

_.extend(
    Player.prototype,
    GameObject.prototype,
    {
        update: function(state) {
            this._cachedMap = state.maps[state.era];

            if (this._spawnCountdown > 0) {
                if (--this._spawnCountdown <= 0) {
                    this.moveToSpawnPoint();
                } else return;
            }

            switch (state.era) {
                case constants.eras.JUNGLE:
                    this.moveSelf_jungle(state);
                    break;
                case constants.eras.TUNDRA:
                    this.moveSelf_tundra(state);
                    break;
                case constants.eras.FUTURE:
                    this.moveSelf_future(state);
                    break;
            }

            if (this._mouseDown) {
                if (!this._lastFireTime || (new Date().getTime() - this._lastFireTime) > this._fireDelay) {
                    this._lastFireTime = new Date().getTime();
                    this.fireWeapon(state);
                }
            }

            // Integrate velocity in to position.
            Player.superclass.prototype.update.call(this, state);

            // Collide with the map.
            this.collideWithMap(state.maps[state.era]);

            this._prevKeysDown = _.clone(this._keysDown);
        },

        moveSelf_jungle: function(state) {
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
            } else if (this._standing > -1 && state.era == constants.eras.FUTURE) {
                if (this._keysDown[constants.keys.JUMP] && !this._prevKeysDown[constants.keys.JUMP]) {
                    this._standing--;
                    this.vy = -10;
                }
            }

            this.vy += GRAVITY;
        },

        moveSelf_future: function(state) {
            this.moveSelf_jungle(state);
        },

        moveSelf_tundra: function(state) {
            this.moveSelf_jungle(state);
        },

        fireWeapon: function(state) {
            var projectile;

            switch (state.era) {
                case constants.eras.TUNDRA:
                    projectile = Axe;
                    break;
                case constants.eras.FUTURE:
                    projectile = Lazer;
                    break;
            }

            if (projectile) {
                projectile = new projectile(this);

                projectile.x = this.x + this.vx;
                projectile.y = this.y - (this.h / 2) + (projectile.h / 2) + this.vy;

                var angle = Math.atan2((this.y - this._mousePos.y - (this.h / 2) - (projectile.h / 2)), (this.x - this._mousePos.x));
                projectile.angle = angle + (Math.PI / 2);

                var cos = Math.cos(angle);
                var sin = Math.sin(angle);

                projectile.vx = -cos * 10;
                projectile.vy = -sin * 10;

                projectile.x -= cos * this.w;
                projectile.y -= sin * this.w;

                state.addObject(projectile);
            }
        },

        moveToSpawnPoint: function() {
            var map = this._cachedMap;
            do {
                this.x = constants.TILE_SIZE * map.getWidth() * Math.random();
                this.y = constants.TILE_SIZE * map.getHeight() * Math.random();
                if (map.sampleAtPixel(this.x, this.y)) continue;
                if (map.sampleAtPixel(this.x, this.y - this.h)) continue;
                if (map.sampleAtPixel(this.x - this.w / 2, this.y - this.h / 2)) continue;
                if (map.sampleAtPixel(this.x + this.w / 2, this.y - this.h / 2)) continue;
                break;
            }
            while (1);
        },

        takeDamage: function(other) {
            if (other._owner) {
                other._owner.kills++;
            }
            this.deaths++;
            this.moveToSpawnPoint();
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
            if (map.sampleAtPixel(this.x, this.y - this.h)) {
                this.y = constants.TILE_SIZE * Math.ceil(this.y / constants.TILE_SIZE);
                if (this.vy < 0) this.vy = 0;
            }
            if (map.sampleAtPixel(this.x - this.w / 2, this.y - this.h / 2)) {
                this.x = constants.TILE_SIZE / 2 + constants.TILE_SIZE * Math.floor(this.x / constants.TILE_SIZE);
                this.vx = 0;
            }
            if (map.sampleAtPixel(this.x + this.w / 2, this.y - this.h / 2)) {
                this.x = constants.TILE_SIZE / 2 + constants.TILE_SIZE * Math.floor(this.x / constants.TILE_SIZE);
                this.vx = 0;
            }
        }
    }
);

module.exports = Player;
