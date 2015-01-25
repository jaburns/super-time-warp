var _ = require('lodash');
var tile_types = require('./public/shared/gj_constants').tile_types;
var tilemap = require('./tile_map');

var TILE_SIZE = 16;

function Map(tiles) {
    this.tiles = tiles;
    this.sampledFatalTile = false;
}

_.extend(
    Map.prototype,
    {
        getWidth: function() { return this.tiles[0].length; },
        getHeight: function() { return this.tiles.length; },

        sampleAtPixel: function(px, py, oneway) {
            var x = Math.floor(px/TILE_SIZE);
            var y = Math.floor(py/TILE_SIZE);

            if (y < 0) y = 0;
            if (y >= this.tiles.length) y = this.tiles.length - 1;
            if (x < 0) x = 0;
            if (x >= this.tiles[0].length) x = this.tiles.length[0] - 1;

            var type = tilemap[this.tiles[y][x]];

            switch (type) {
                case tile_types.FATAL: this.sampledFatalTile = true;
                case tile_types.SOLID: return true;
                case tile_types.ONE_WAY: return !!oneway;
            }
            // tile_types.NO_COLLISION:
            return false;
        }
    }
);

module.exports = Map;
