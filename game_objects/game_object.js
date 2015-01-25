var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var GameObject = function(id) {

    this.id = id || Math.random().toString().substr(2);

    this.alive = true;

    this.x = this.x || null;
    this.y = this.y || null;

    this.w = this.w || null;
    this.h = this.h || null;

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

            this.x += this.vx;
            this.y += this.vy;

            this.angle += this.va;

        },

        dispose: function() {

        }
    }
);

module.exports = GameObject;
