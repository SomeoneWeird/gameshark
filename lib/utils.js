"use strict";

var toHex = function(str) {
    return str.toString(16);
};

var fromHex = function(str) {
    return parseInt(str, 16);
};

var addTo = function(d, k, v) {
    var t = fromHex(v);
    if(isNaN(t)) {
        d[k] = v;
        return;
    }
    d["_" + k] = v;
    d[k]       = t;
};

var match = function(str, reg) {
    var tmp = str.match(reg);
    if(!tmp) return;
    tmp.shift();
    return Array.prototype.slice.call(tmp);
};

var toBytes = function(str) {

    var t = str.split("").filter(function(char) {
        return char != " ";
    });

    var bytes = [];

    for(var i = 0; i < t.length; i++) {
        bytes.push(t[i] + t[++i]);
    }

    return bytes;

};

exports.toHex   = toHex;
exports.fromHex = fromHex;
exports.addTo   = addTo;
exports.match   = match;
exports.toBytes = toBytes;
