var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var Projectile = require('./projectile');

var Lazer = function(owner, target) {

    this.type = 'lazer';
    this.width = 8;

    Lazer.superclass.call(this, owner, target);

};

Lazer.superclass = Projectile;

_.extend(
    Lazer.prototype,
    Projectile.prototype,
    {

    }
);

module.exports = Lazer;
