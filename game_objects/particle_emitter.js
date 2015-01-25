var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var GameObject = require('./game_object');

var ParticleEmitter = function(x, y) {

    this.type = 'particle_emitter';
    this.x = x;
    this.y = y;
    this.lifetime = this.lifetime || 10;
    this._lifetime = 1;

    ParticleEmitter.superclass.call(this);

};

ParticleEmitter.superclass = GameObject;

_.extend(
    ParticleEmitter.prototype,
    GameObject.prototype,
    {
        update: function() {
            if (--this._lifetime < 0) {
                this.alive = false;
            }
        }
    }
);

module.exports = ParticleEmitter;
