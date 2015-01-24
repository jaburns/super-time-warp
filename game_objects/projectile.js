var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var GameObject = require('./game_object');
var Player = require('./player');

var Projectile = function(owner) {
    Projectile.superclass.call(this);

    this.owner = owner;
    this.type = 'bullet';
};

Projectile.superclass = GameObject;

_.extend(
    Projectile.prototype,
    GameObject.prototype,
    {
        update: function(state) {
            Projectile.superclass.prototype.update.call(this, state);

            this.collideWithMap(state.maps[state.era]);
        },

        collideWithObject: function(object) {
            if (object === this.owner) return;
            if (object.takeDamage) {
                object.takeDamage ();
                this.alive = false;
            }
        },

        collideWithMap: function(map, onCollision) {
            if (map.sampleAtPixel(this.x, this.y - this.h/2)) {
                this.alive = false;
            }
        }
    }
);

module.exports = Projectile;
