var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var Projectile = require('./projectile');
var Projectilesplosion = require('./projectilesplosion');

var GRAVITY = 0.5;

var Axe = function(owner, target) {


    this.type = 'axe';

    var dx = Math.abs(target.x - owner.x) / 104;
    target.y -= 32 * dx * dx;//(32 * (dx / 104));
    //target.y -= 32;

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

            if (!this.alive) {
                var emitter = new Projectilesplosion(this.x, this.y - this.h / 2);
                emitter.particleSettings.textures = ['axe_1', 'axe_2'];
                emitter.particleSettings.maxV = 4;
                emitter.particleSettings.initialVy = -4;
                emitter.particleSettings.gravity = 1;
                state.addObject(emitter);
            }

        }
    }
);

module.exports = Axe;
