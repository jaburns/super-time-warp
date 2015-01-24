var _ = require('lodash');

var GameObject = function() {
    this.x = null;
    this.y = null;

    this.xVelocity = 0;
    this.yVelocity = 0;
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