
var gj_CONSTANTS = {
    DELTA_TIME: 35,
    TILE_SIZE: 16,
    keys: {
        JUMP: 32,
        JUMP2: 87,
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
        CYAN: 'cyan',
        PINK: 'pink',
        YELLOW: 'yellow',
        GREEN: 'green',
        ORANGE: 'orange',
        BLUE: 'blue',
        PURPLE: 'purple'
    },
    tile_types: {
        NO_COLLISION: 0,
        SOLID: 1,
        ONE_WAY: 2,
        FATAL: 3
    }
};

if (typeof(module) !== 'undefined') module.exports = gj_CONSTANTS;
