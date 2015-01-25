var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var ParticleEmitter = require('./particle_emitter');

var Projectilesplosion = function(x, y) {

    this.lifetime = 50;
    this._lifetime = 50;

    this.particleSettings = {
        //texture: 'particle.png',
        minCount: 5,
        maxCount: 10,
        minV: 2,
        maxV: 10,
        initialVx: 2,
        initialVy: 2,
        minScale: 1,
        maxScale: 1,
        gravity: 0,
        alphaDecay: 0.05,
        minAngle: 0,
        maxAngle: 2 * Math.PI
    };

    Projectilesplosion.superclass.call(this, x, y);

};

Projectilesplosion.superclass = ParticleEmitter;

_.extend(
    Projectilesplosion.prototype,
    ParticleEmitter.prototype,
    {

    }
);

module.exports = Projectilesplosion;
