var _ = require('lodash');

var GameObject = function(id) {

    this.id = id || Math.random().toString().substr(2);

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

            this.x += this.vx;
            this.y += this.vy;

            this.angle += this.va;

        }
    }
);

module.exports = GameObject;
