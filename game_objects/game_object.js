var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var MAX_VELOCITY = 1234;
var DELTA_VELOCITY = 1234;

var GRAVITY = 0.5;

var GameObject = function(id) {

    this.id = id || Math.random().toString().substr(2);

    this.alive = true;

    this.x = null;
    this.y = null;

    this.w = null;
    this.h = null;

    this.vx = 0;
    this.vy = 0;

    this.angle = 0;
    this.va = 0;

};

_.extend(
    GameObject.prototype,
    {
        update: function(state) {

            if (!this.alive) return;

            this.vy += GRAVITY;

            this.x += this.vx;
            this.y += this.vy;

            this.angle += this.va;

        },

        dispose: function() {

        }
    }
);

module.exports = GameObject;
