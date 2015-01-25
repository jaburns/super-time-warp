
var gj_CONSTANTS = {
    DELTA_TIME: 35,
    TILE_SIZE: 16,
    keys: {
        JUMP: 32,
        MOVE_LEFT: 65,
        MOVE_RIGHT: 68
    },
    eras: {
        JUNGLE: 0,
        TUNDRA: 1,
        FUTURE: 2
    },
    player_colors: {
        RED: 'red',
        ORANGE: 'orange',
        YELLOW: 'yellow',
        GREEN: 'green',
        CYAN: 'cyan',
        BLUE: 'blue',
        PURPLE: 'purple',
        PINK: 'pink'
    },
    tile_types: {
        NO_COLLISION: 0,
        SOLID: 1,
        ONE_WAY: 2,
        FATAL: 3
    }
};

if (typeof(module) !== 'undefined') module.exports = gj_CONSTANTS;
