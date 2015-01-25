var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var ParticleEmitter = require('./particle_emitter');

var Bloodsplosion = function(x, y) {

    this.lifetime = 10;
    this._lifetime = 10;

    this.particleSettings = {
        texture: 'particle.png',
        minCount: 100,
        maxCount: 100,
        minV: 0,
        maxV: 5,
        initialVx: 0,
        initialVy: -8,
        minScale: 1,
        maxScale: 3,
        gravity: 2,
        alphaDecay: 0.1,
        minAngle: 0,
        maxAngle: 2 * Math.PI
    };

    Bloodsplosion.superclass.call(this, x, y);

};

Bloodsplosion.superclass = ParticleEmitter;

_.extend(
    Bloodsplosion.prototype,
    ParticleEmitter.prototype,
    {

    }
);

module.exports = Bloodsplosion;
