var _ = require('lodash');
var constants = require('../public/shared/gj_constants');
var GameObject = require('./game_object');

var MAX_VELOCITY = 1234;
var DELTA_VELOCITY = 1234

var Player = function(id) {

    Player.superclass.call(this, id);

    this.type = 'player';

};

Player.superclass = GameObject;

_.extend(
    Player.prototype,
    GameObject.prototype,
    {
        update: function(state) {

            Player.superclass.prototype.update.call(this, state);

        },
        handleInput: function(input) {

            switch (input) {
                case constants.keys.SPACEBAR:
                    break;
                case constants.keys.LEFT_ARROW:
                    break;
                case constants.keys.UP_ARROW:
                    break;
                case constants.keys.RIGHT_ARROW:
                    break;
                case constants.keys.DOWN_ARROW:
                    break;
            }

        }
    }
);

module.exports = Player;
