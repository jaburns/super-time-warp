var _ = require('lodash');

function Map(tiles) {
    this.tiles = tiles;
    console.log (tiles[1][1]);
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
