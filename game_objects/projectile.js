var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var GameObject = require('./game_object');

var Projectile = function(owner) {
    Projectile.superclass.call(this);

    this._owner = owner;

    this.w = 16;
    this.h = 16;

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
            if (object === this._owner) return;
            if (object.takeDamage) {
                object.takeDamage(this);
                this.alive = false;
            }
        },

        collideWithMap: function(map) {
            if (map.sampleAtPixel(this.x, this.y - this.h)
             || map.sampleAtPixel(this.x, this.y)
             || map.sampleAtPixel(this.x - this.w/2, this.y - this.h/2)
             || map.sampleAtPixel(this.x + this.w/2, this.y - this.h/2)) {
                this.alive = false;
            }
        }
    }
);

module.exports = Projectile;
