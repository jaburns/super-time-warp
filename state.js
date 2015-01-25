var _ = require('lodash');
var constants = require('./public/shared/gj_constants');

var Map = require('./map');
var loadTMX = require('./loadTMX');

var ERA_FRAMECOUNT_MIN =  600;
var ERA_FRAMECOUNT_MAX = 1000;

var State = function() {
    // initial state

    this.era = constants.eras.FUTURE;
    this.maps = {};
    this.objects = [];
    this.countDownToNextEra = ERA_FRAMECOUNT_MIN + (ERA_FRAMECOUNT_MAX - ERA_FRAMECOUNT_MIN) * Math.random();

    var self = this;

    _.each([
            ['jungle', constants.eras.JUNGLE],
            ['tundra', constants.eras.TUNDRA],
            ['future', constants.eras.FUTURE]
        ],
        function(a) {
            loadTMX('./maps/' + a[0] + '.tmx', function(data) {
                self.maps[a[1]] = new Map(data);
            });
        }
    );
};

_.extend(
    State.prototype,
    {
        step: function() {
            if (--this.countDownToNextEra <= 0) {
                this.countDownToNextEra = ERA_FRAMECOUNT_MIN + (ERA_FRAMECOUNT_MAX-ERA_FRAMECOUNT_MIN)*Math.random();

                var self = this;
                this.era = _.chain(constants.eras)
                    .filter(function(era) { return era !== self.era; })
                    .sample()
                    .value();
            }
        },

        getState: function() {
            return {
                timeToTimeWarp: this.countDownToNextEra * constants.DELTA_TIME / 1000,
                era: this.era,
                maps: this.maps,
                objects: this.objects
            }
        },

        addObject: function(object) {
            this.objects.push(object);
        },

        getObjectById: function(id) {
            for (var i = 0; i < this.objects.length; i++) {
                var object = this.objects[i];
                if (object.id == id) {
                    return object;
                }
            }
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
