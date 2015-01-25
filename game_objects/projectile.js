var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var GameObject = require('./game_object');

var Projectile = function(owner, target) {
    Projectile.superclass.call(this);

    this._owner = owner;

    this.MAX_V = this.MAX_V || 10;

    this.w = this.w || 16;
    this.h = this.h || 16;

    this.x = owner.x + owner.vx;
    this.y = owner.y - (owner.h / 2) + (this.h / 2) + owner.vy;

    var angle = Math.atan2((owner.y - target.y - (owner.h / 2) - (this.h / 2)), (owner.x - target.x));
    this.angle = angle + (Math.PI / 2);

    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    this.vx = -cos * this.MAX_V;
    this.vy = -sin * this.MAX_V;

    this.x -= cos * owner.w;
    this.y -= sin * owner.w;

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

        collideWithObject: function(object, state) {
            if (object === this._owner) return;
            if (object.takeDamage) {
                object.takeDamage(this, state);
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
