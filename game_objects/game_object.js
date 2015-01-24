var _ = require('lodash');

var GameObject = function(id) {

    this.id = id || Math.random().toString().substr(2);

    this.x = null;
    this.y = null;

    this.width = null;
    this.height = null;

    this.vx = 0;
    this.vy = 0;

    this.rotation = 0;

};

_.extend(
    GameObject.prototype,
    {
        update: function(state) {

            this.x += this.vx;
            this.y += this.vy;

        }
    }
);

module.exports = GameObject;
