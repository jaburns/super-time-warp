var _ = require('lodash');

function Game() {
    this.state = {
        map: [
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
            [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
            [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
            [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
            [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
            [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
            [ 1, 0, 0, 1, 1, 1, 1, 0, 0, 1 ],
            [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
            [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
        ],
        objects: []
    };
}

Game.prototype.addPlayer = function(id) {
    this.state.objects.push({
        id: id,
        x: 34,
        y: 34,
        type: 'player'
    });
};

Game.prototype.removePlayer = function(id) {
    for (var i = 0; i < this.state.objects.length; i++) {
        var object = this.state.objects[i];
        if (object.id == id && object.type == 'player') {
            this.state.objects.splice(i);
            return;
        }
    }
};

Game.prototype.step = function() {
    var state = this.state;
    _.each(state.objects, function(object) {
        object.update && object.update(state)
    });
};