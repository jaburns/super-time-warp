var _ = require('lodash');
var constants = require('./public/shared/gj_constants');

var Map = require('./map');
var loadTMX = require('./loadTMX');

var State = function() {
    // initial state

    this.era = constants.eras.TUNDRA;
    this.maps = {};
    this.objects = [];

    var self = this;

    _.each([['jungle',constants.eras.JUNGLE],
            ['tundra',constants.eras.TUNDRA],
            ['future',constants.eras.FUTURE]],
        function(a) {
            loadTMX('./maps/'+a[0]+'.tmx',function(data) {
                self.maps[a[1]] = new Map(data);
            });
        }
    );
};

_.extend(
    State.prototype,
    {
        getState: function() {
            return {
                era: this.era,
                maps: this.maps,
                objects: this.objects
            }
        },

        addObject: function(object) {
            this.objects.push(object);
        },

        removeObject: function(object) {
            var index = this.objects.indexOf(object);
            if (index > -1) this.objects.splice(index, 1);
            object.dispose();
        },

        removeObjectById: function(id) {
            for (var i = 0; i < this.objects.length; i++) {
                var object = this.objects[i];
                if (object.id == id) {
                    this.objects.splice(i, 1);
                    object.dispose();
                    return;
                }
            }
        }
    }
);

module.exports = State;
