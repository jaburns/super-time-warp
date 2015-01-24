
var gj_CONSTANTS = {
    DELTA_TIME: 35,
    TILE_SIZE: 16,
    keys: {
        JUMP: 87,
        MOVE_LEFT: 65,
        MOVE_RIGHT: 68
    },
    eras: {
        PAST: 1,
        PRESENT: 2,
        FUTURE: 3
    }
};

if (typeof(module) !== 'undefined') module.exports = gj_CONSTANTS;
