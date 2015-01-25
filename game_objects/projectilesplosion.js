var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var ParticleEmitter = require('./particle_emitter');

var Projectilesplosion = function(x, y) {

    this.lifetime = 10;
    this._lifetime = 10;

    this.particleSettings = {
        //texture: 'particle.png',
        minCount: 5,
        maxCount: 10,
        minV: 0,
        maxV: 2,
        initialVx: 0,
        initialVy: 0,
        minScale: 1,
        maxScale: 1,
        gravity: 0,
        alphaDecay: 0.1,
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
