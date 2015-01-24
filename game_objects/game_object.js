var _ = require('lodash');

var GameObject = function(id) {

    this.id = id;

    this.x = null;
    this.y = null;

    this.width = null;
    this.height = null;

    this.xVelocity = 0;
    this.yVelocity = 0;

    this.rotation = 0;

};

_.extend(
    GameObject.prototype,
    {
        update: function(state) {

            this.x += this.xVelocity;
            this.y += this.yVelocity;

        }
    }
);