
"use strict";

var fs   = require("fs");
var path = require("path");

var fns = {};

fs.readdirSync(path.join(__dirname, "types")).forEach(function(f) {
    var t = require(path.join(__dirname, "types", f));
    fns[t.name] = t.fn;
});

module.exports = fns;
