var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var Projectile = require('./projectile');
var Projectilesplosion = require('./projectilesplosion');

var Lazer = function(owner, target) {

    this.type = 'lazer';
    this.w = 8;
    this.h = 8;

    this.MAX_V = 15;

    //target.y += 5;

    Lazer.superclass.call(this, owner, target);

    //this.y += 6;

};

Lazer.superclass = Projectile;

_.extend(
    Lazer.prototype,
    Projectile.prototype,
    {
        update: function(state) {

            Lazer.superclass.prototype.update.call(this, state);

            if (!this.alive) {
                var d = this.vx / Math.abs(this.vx);
                var emitter = new Projectilesplosion(this.x - (this.w / 2 * d), this.y - this.h / 2);
                emitter.particleSettings.textures = ['lazer_1', 'lazer_2'];
                state.addObject(emitter);
            }

        }
    }
);

module.exports = Lazer;
