var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var ParticleEmitter = require('./particle_emitter');

var Bloodsplosion = function(x, y) {

    this.lifetime = 100;

    this.particleSettings = {
        textures: ['gore_1', 'gore_2'],
        minCount: 25,
        maxCount: 40,
        minV: 1,
        maxV: 5,
        initialVx: 0,
        initialVy: -8,
        minScale: 1,
        maxScale: 1,
        gravity: 1,
        alphaDecay: 0.04,
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
