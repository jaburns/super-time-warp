var _ = require('lodash');
var constants = require('../public/shared/gj_constants');

var Projectile = require('./projectile');

var Lazer = function(owner, target) {

    this.type = 'lazer';
    this.w = 8;
    this.h = 8;

    this.MAX_V = 15;

    //target.y += 5;

    Lazer.superclass.call(this, owner, target);

    //this.y += 6;

};

Lazer.superclass = Projectile;

_.extend(
    Lazer.prototype,
    Projectile.prototype,
    {

    }
);

module.exports = Lazer;
