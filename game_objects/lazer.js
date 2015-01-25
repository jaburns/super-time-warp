var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var Projectile = require('./projectile');

var Lazer = function(owner) {
    Lazer.superclass.call(this, owner);

    this.type = 'lazer';
    this.width = 8;

};

Lazer.superclass = Projectile;

_.extend(
    Lazer.prototype,
    Projectile.prototype,
    {

    }
);

module.exports = Lazer;
