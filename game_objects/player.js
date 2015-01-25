var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var GameObject = require('./game_object');
var Bloodsplosion = require('./bloodsplosion');
var Projectilesplosion = require('./projectilesplosion');
var Axe = require('./axe');
var Lazer = require('./lazer');

var SPAWN_COUNTDOWN = 30;
var INVULNERABLE_COUNTDOWN = 30;

var Player = function(id, color) {

    Player.superclass.call(this, id);

    this.type = 'player';
    this.color = color;
    this.x = 400;
    this.y = 320;
    this.w = 16;
    this.h = 24;

    this.kills = 0;
    this.deaths = 0;
    this.facex = 1;

    this.dead = false;
    this.droppingKick = false;
    this.jumping = false; // used by client to display correct animation frame

    // Sound hooks
    this.jumped = false;
    this.justDied = false;
    this.startedPound = false;
    this.endedPound = false;
    this.justKilled = false;

    this.spawnCountdown = SPAWN_COUNTDOWN;
    this.invulnerableCountdown = INVULNERABLE_COUNTDOWN;

    this._keysDown = {};
    this._prevKeysDown = {};
    this._mousePos = { x: null, y: null };
    this._mouseDown = false;
    this._mouseClick = false;
    this._standing = 0; // When greater than zero, the player is on the ground.  Counts down every frame. Reset every time a ground collision is detected.
    this._roofing = 0; // same as standing but for roof

    this._cachedMap = null;
    this._fireDelay = 400;
    this._lastFireTime = null;
};

Player.superclass = GameObject;

_.extend(
    Player.prototype,
    GameObject.prototype,
    {
        update: function(state) {
            this._cachedMap = state.maps[state.era];

            // Reset single-frame sound indicator booleans.
            this.jumped = false;
            this.startedPound = false;
            this.endedPound = false;
            this.justKilled = false;

            if (this.justDied) {
                var emitter = new Bloodsplosion(this.x, this.y - this.h / 2);
                state.addObject(emitter);
                this.justDied = false;
                this.dead = true;
                this.vx = this.vy = 0;
                this.spawnCountdown = SPAWN_COUNTDOWN;
                this.invulnerableCountdown = INVULNERABLE_COUNTDOWN;
                return;
            }

            if (this.spawnCountdown > 0) {
                if (--this.spawnCountdown <= 0) {
                    this.dead = false;
                    this.moveToSpawnPoint();
                } else return;
            }

            if (this.invulnerableCountdown > 0) {
                --this.invulnerableCountdown;
            }

            if (this._keysDown[constants.keys.MOVE_LEFT]) {
                this.facex = -1;
            } else if (this._keysDown[constants.keys.MOVE_RIGHT]) {
                this.facex = 1;
            }

            if (this._standing > 0) this._standing--;
            if (this._roofing > 0) this._roofing--;

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

            // Integrate velocity in to position and collide with the map.
            this.x += this.vx / 2;
            this.y += this.vy / 2;
            this.collideWithMap(state.maps[state.era], this.takeDamage.bind(this, null));
            this.x += this.vx / 2;
            this.y += this.vy / 2;
            this.collideWithMap(state.maps[state.era], this.takeDamage.bind(this, null));

            if (this.endedPound) {
                var emitter = new Projectilesplosion(this.x, this.y);
                emitter.particleSettings.textures = ['grass', 'dirt'];
                emitter.particleSettings.maxV = 4;
                emitter.particleSettings.initialVy = -4;
                emitter.particleSettings.gravity = 1;
                state.addObject(emitter);
            }

            this._prevKeysDown = _.clone(this._keysDown);
            this._mouseClick = false;
        },

        collideWithObject: function(other) {
            if (this.droppingKick && other.takeDamage) {
                if (this.y > other.y || !other.droppingKick) {
                    other.takeDamage(this);
                    this.kills++;
                    this.justKilled = true;
                }
            }
        },

        _moveX: function(turnx, accx, decayx, maxx) {
            if (this._keysDown[constants.keys.MOVE_LEFT]) {
                this.vx += this.vx > 0 ? -turnx : -accx;
            } else if (this._keysDown[constants.keys.MOVE_RIGHT]) {
                this.vx += this.vx < 0 ? turnx : accx;
            } else {
                this.vx *= decayx;
            }
            if (this.vx > maxx) {
                this.vx = maxx;
            } else if (this.vx < -maxx) {
                this.vx = -maxx;
            }
        },

        moveSelf_future: function(state) {
            var JET_UP = 1.2;
            var JET_SAVE = 1.6;

            if (this._standing) {
                this._moveX(2, 0.5, 0.8, 4);// Ground
            } else {
                this._moveX(0.5, 0.3, 1, 6);// Air
            }

            this.jumping = this._keysDown[constants.keys.JUMP] || this._keysDown[constants.keys.JUMP2];
            if (this.jumping) {
                if (this._standing) this.jumped = true;
                this._standing = 0;
                this.vy -= this.vy >= 0 ? JET_SAVE : JET_UP;
                this.vy -= 0.3;
            }

            this.vy += 0.8;

            if (this._roofing > 0) {
                this.vy = 4;
            }

            if (this.vy > 12) {
                this.vy = 12;
            }
            else if (this.vy < -6) {
                this.vy = -6;
            }
        },

        moveSelf_basic: function(state) {
            if (this._standing) {
                this._moveX(2, 0.5, 0.8, 6);// Ground
            } else {
                this._moveX(1, 0.3, 0.9, 6);// Air
            }

            if (this._keysDown[constants.keys.JUMP] || this._keysDown[constants.keys.JUMP2]) {
                if (this._standing > 0) {
                    this._standing = 0;
                    this.vy = -10;
                    this.jumped = true;
                }
                if (this.vy < 0) {
                    this.vy -= 0.5;
                    this.y -= 0.3;
                }
            }

            this.vy += 1.0;

            if (this.vy > 12) {
                this.vy = 12;
            }

            this.jumping = !this._standing && this.vy < 0;
        },

        _startKick: function() {
            this.droppingKick = true;
            this.startedPound = true;
            var theta = Math.atan2(this._mousePos.y - (this.y - this.h / 2), this._mousePos.x - this.x);
            if (theta > 0) {
                if (theta < Math.PI / 4) theta = Math.PI / 4;
                else if (theta > 3 * Math.PI / 4) theta = 3 * Math.PI / 4;
            } else {
                if (theta > -Math.PI / 2) theta = Math.PI / 4;
                else                    theta = 3 * Math.PI / 4;
            }
            this.vx = 15 * Math.cos(theta);
            this.vy = 15 * Math.sin(theta);
            this.facex = this.vx > 0 ? 1 : -1;
        },

        moveSelf_jungle: function(state) {
            if (this._standing) {
                if (this.droppingKick) {
                    this.endedPound = true;
                }
                this.droppingKick = false;
            } else if (this._mouseClick && !this.droppingKick) {
                this._startKick();
            }

            if (!this.droppingKick) {
                this.moveSelf_basic(state);
            }
        },

        moveSelf_tundra: function(state) {
            this.moveSelf_basic(state);
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
                projectile = new projectile(this, { x: this._mousePos.x, y: this._mousePos.y });

                state.addObject(projectile);
            }
        },

        moveToSpawnPoint: function() {
            var map = this._cachedMap;
            var spawnPoint = _.sample(map._spawnPoints);
            this.x = constants.TILE_SIZE * spawnPoint[0];
            this.y = constants.TILE_SIZE * spawnPoint[1];
        },

        takeDamage: function(other) {
            if (this.justDied || this.dead) return;
            if (other && other._owner) {
                other._owner.kills++;
                other._owner.justKilled = true;
            }
            this.deaths++;
            this.justDied = true;
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
                    this._mouseClick = true;
                    this._mouseDown = true;
                    break;
                case 'mouseup':
                    this._mouseDown = false;
                    break;
            }
        },

        collideWithMap: function(map, damaged) {
            map._sampledFatalTile = false;

            if (map.sampleAtPixel(this.x - this.w / 2, this.y - this.h / 2)
                || map.sampleAtPixel(this.x - this.w / 2, this.y - 2 - (this.vy > 0 ? this.vy : 0))
                || map.sampleAtPixel(this.x - this.w / 2, this.y - this.h + 2)) {
                this.x = constants.TILE_SIZE / 2 + constants.TILE_SIZE * Math.floor(this.x / constants.TILE_SIZE);
                if (this.droppingKick) {
                    this.droppingKick = false;
                    this.endedPound = true;
                    this.vx = Math.abs(this.vx) / 2;
                } else {
                    this.vx = 0;
                }
            }
            if (map.sampleAtPixel(this.x + this.w / 2, this.y - this.h / 2)
                || map.sampleAtPixel(this.x + this.w / 2, this.y - 2 - (this.vy > 0 ? this.vy : 0))
                || map.sampleAtPixel(this.x + this.w / 2, this.y - this.h + 2)) {
                this.x = constants.TILE_SIZE / 2 + constants.TILE_SIZE * Math.floor(this.x / constants.TILE_SIZE);
                if (this.droppingKick) {
                    this.droppingKick = false;
                    this.endedPound = true;
                    this.vx = -Math.abs(this.vx) / 2;
                } else {
                    this.vx = 0;
                }
            }
            if (map.sampleAtPixel(this.x + this.w / 2 - 2, this.y, this.vy > 0)
                || map.sampleAtPixel(this.x - this.w / 2 + 2, this.y, this.vy > 0)) {
                this.y = constants.TILE_SIZE * Math.floor(this.y / constants.TILE_SIZE);
                this.vy = 0;
                this._standing = 2;
            }
            if (map.sampleAtPixel(this.x + this.w / 2 - 2, this.y - this.h)
                || map.sampleAtPixel(this.x - this.w / 2 + 2, this.y - this.h)) {
                this.y = constants.TILE_SIZE * Math.ceil(this.y / constants.TILE_SIZE);
                if (this.vy < 0) this.vy = 0;
                this._roofing = 2;
            }

            // TODO make sure taking damage here doesnt allow double death
            if (map._sampledFatalTile && damaged && !this.invulnerableCountdown) damaged();
        }
    }
);

module.exports = Player;
