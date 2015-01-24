
var gj_CONSTANTS = {
    DELTA_TIME: 35,
    TILE_SIZE: 16,
    keys: {
        SPACEBAR: 32,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40
    },
    eras: {
        PAST: 1,
        PRESENT: 2,
        FUTURE: 3
    }
};

if (typeof(module) !== 'undefined') module.exports = gj_CONSTANTS;
