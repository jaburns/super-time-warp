
var gj_CONSTANTS = {
    DELTA_TIME: 35,
    TILE_SIZE: 16,
    keys: {
        JUMP: 32,
        MOVE_LEFT: 37,
        MOVE_RIGHT: 39
    },
    eras: {
        PAST: 1,
        PRESENT: 2,
        FUTURE: 3
    }
};

if (typeof(module) !== 'undefined') module.exports = gj_CONSTANTS;
