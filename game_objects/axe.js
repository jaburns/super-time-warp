var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var Projectile = require('./projectile');

var GRAVITY = 0.5;

var Axe = function(owner) {
    Axe.superclass.call(this, owner);

    this.type = 'axe';
    this._vx = null;

    Object.defineProperty(this, 'vx', {
        enumerable: true,
        configurable: true,
        get: function() {
            return this._vx;
        },
        set: function(value) {
            this.va = 0.1 * value;
            this._vx = value;
        }

    });

};

Axe.superclass = Projectile;

_.extend(
    Axe.prototype,
    Projectile.prototype,
    {
        update: function(state) {

            this.vy += GRAVITY;

            Axe.superclass.prototype.update.call(this, state);

        }
    }
);

module.exports = Axe;
