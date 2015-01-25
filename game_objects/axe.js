var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var Projectile = require('./projectile');

var GRAVITY = 0.5;

var Axe = function(owner, target) {


    this.type = 'axe';

    target.y -= 32;

    Axe.superclass.call(this, owner, target);

    this.va = 0.1 * this.vx;

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
