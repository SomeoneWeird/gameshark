"use strict";

var utils = require("../lib/utils");

var OPS = {
    "0": {
        "OP": "8CW",
        "regex": /0(\d)([0-9a-f]{2})([0-9a-f]{4})/i,
        "matches": [ "bank", "value", "address" ]
    }
};

var activators = {
    "A":        0x0001,
    "B":        0x0002,
    "SELECT":   0x0004,
    "START":    0x0008,
    "RIGHT":    0x0010,
    "LEFT":     0x0020,
    "UP":       0x0040,
    "DOWN":     0x0080,
    "RTRIGGER": 0x0100,
    "LTRIGGER": 0x0200
};

var processOP = function(type, code) {
    var op = OPS[type];
    if(!op) return;
    var response = { code: code, op: op.OP, data: {} };
    if(op.fn) {
        op.fn(type, code, response);
        return response;
    }
    var m = utils.match(code, op.regex);
    for(var i = 0; i < m.length; i++) {
        utils.addTo(response.data, op.matches[i], m[i]);
    }
    return response;
};

var parseGBC = function parseGBC(code) {
    var type = code.match(/([0-9a-f]{1})/i)[1];
    var response = processOP(type, code);
    return response;
};

module.exports = {
    "name": "gbc",
    "fn":   parseGBC
};
