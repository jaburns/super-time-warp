var _ = require('lodash');

var TILE_SIZE = 16;

function Map(tiles) {
    this.tiles = tiles;
}

_.extend(
    Map.prototype,
    {
        sampleAtPixel: function(px, py) {
            var x = Math.floor(px/TILE_SIZE);
            var y = Math.floor(py/TILE_SIZE);

            if (y < 0) y = 0;
            if (y >= this.tiles.length) y = this.tiles.length - 1;
            if (x < 0) x = 0;
            if (x >= this.tiles[0].length) x = this.tiles.length[0] - 1;

            return this.tiles[y][x];
        }
    }
);

module.exports = Map;
