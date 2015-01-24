var _ = require('lodash');
var GameObject = require('./game_object');

var Projectile = function(id) {

    Projectile.superclass.call(this, id);

};

Projectile.superclass = GameObject;

_.extend(
    Projectile.prototype,
    GameObject.prototype,
    {
        update: function(state) {

            Projectile.superclass.prototype.update.call(this, state);

        }
    }
);

