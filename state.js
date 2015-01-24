var _ = require('lodash');
var constants = require('./public/shared/gj_constants');

var Map = require('./map');

var State = function() {

    // map definitions
    var maps = {};
    maps[constants.eras.PRESENT] = new Map([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]);

    // initial state
    this._state = {
        era: constants.eras.PRESENT,
        maps: maps,
        objects: []
    };
};

_.extend(
    State.prototype,
    {
        getState: function() {
            return this._state;
        },

        addObject: function(object) {
            this._state.objects.push(object);
        },

        removeObject: function(object) {
            var index = this._state.objects.indexOf(object);
            if (index > -1) this._state.objects.splice(index, 1);
        },

        removeObjectById: function(id) {
            for (var i = 0; i < this._state.objects.length; i++) {
                var object = this._state.objects[i];
                if (object.id == id) {
                    this._state.objects.splice(i, 1);
                    return;
                }
            }
        }
    }
);

module.exports = State;