var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var GameObject = require('./game_object');

var Projectile = function(id) {

    Projectile.superclass.call(this, id);

    this.type = 'bullet';

};

Projectile.superclass = GameObject;

_.extend(
    Projectile.prototype,
    GameObject.prototype,
    {
        update: function(state) {

            Projectile.superclass.prototype.update.call(this, state);

            var self = this;
            this.collideWithMap(state.maps[state.era], function() {
                self.alive = false;
            });

        },

        collideWithMap: function(map, onCollision) {
            if (map.sampleAtPixel(this.x, this.y)
                || map.sampleAtPixel(this.x, this.y - constants.TILE_SIZE)
                || map.sampleAtPixel(this.x - constants.TILE_SIZE / 2, this.y - constants.TILE_SIZE / 2)
                || map.sampleAtPixel(this.x + constants.TILE_SIZE / 2, this.y - constants.TILE_SIZE / 2)) {

                onCollision && onCollision();

            }
        }
    }
);

module.exports = Projectile;
