var _ = require('lodash');

var State = function(map) {
    this.map = map;
    this.objects = [];
};

_.extend(
    State.prototype,
    {
        getState: function() {
            return this._state;
        },

        addObject: function(object) {
            this.object.push(object);
        },

        removeObject: function(object) {
            var index = this.objects.indexOf(object);
            if (index > -1) this.objects.splice(index, 1);
        },

        removeObjectById: function(id) {
            for (var i = 0; i < this.objects.length; i++) {
                var object = this.objects[i];
                if (object.id == id) {
                    this.objects.splice(i, 1);
                    return;
                }
            }
        }
    }
);

module.exports = State;