
var fs = require('fs');
var _ = require('lodash');
var xml2js = require('xml2js');

module.exports = function (path,cb) {
    var xml = fs.readFileSync(path);
    xml2js.parseString(xml, function (err,result) {
        cb(err ? err : _.filter(_.map(result.map.layer[0].data[0]._.split('\n'), function (strRow) {
            return _.filter(_.map(strRow.split(','), function (item) {
                return _.parseInt(item);
            }),function (num) {
                return !isNaN(num);
            });
        }),function (row) {
            return row.length > 0;
        }));
    });
}
