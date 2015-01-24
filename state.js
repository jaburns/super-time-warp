var _ = require('lodash');
var constants = require('./public/shared/gj_constants');

var Map = require('./map');
var loadTMX = require('./loadTMX');

var State = function() {
    // initial state
    this._state = {
        era: constants.eras.PRESENT,
        maps: {},
        objects: []
    };

    var that = this;
    loadTMX('./maps/present.tmx',function(data) {
        console.log (JSON.stringify(data));
        that._state.maps[constants.eras.PRESENT] = new Map(data);
    })
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
