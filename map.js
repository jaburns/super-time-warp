var _ = require('lodash');

function Map(tiles) {
    this.tiles = tiles;
}

_.extend(
    Map.prototype,
    {
        getTile: function(x, y) {
            return this.tiles[y][x];
        }
    }
);

module.exports = Map;