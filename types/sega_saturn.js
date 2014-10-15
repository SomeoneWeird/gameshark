"use strict";

var utils = require("../lib/utils");

var OPS = {
    "1": {
        "OP": "16CW",
        "regex": /1([0-9a-f]{6})\s?([0-9a-f]{4})/i,
        "matches": [ "address", "value" ]
    },
    "3": {
        "OP": "8CW",
        "regex": /3([0-9a-f]{6})\s?00([0-9a-f]{2})/i,
        "matches": [ "address", "value" ]
    },
    "0": {
        "OP": "16WO",
        "regex": /0([0-9a-f]{6})\s?([0-9a-f]{4})/i,
        "matches": [ "address", "value" ]
    },
    "D": {
        "OP": "16EA",
        "fn": function(type, code, response) {
            var m = utils.match(code, /D([0-9a-f]{6})\s?([0-9a-f]{4})\n(.+)\n?/i);
            if(!m) return;
            utils.addTo(response.data, "address", m[0]);
            utils.addTo(response.data, "value",   m[1]);
            var cType = m[2].match(/^(..)/)[1];
            utils.addTo(response.data, "code", processOP(cType, m[2]));
        }
    },
    "F": {
        "OP": "16EC",
        "regex": /F([0-9a-f]{6})\s?([0-9a-f]{6})/i,
        "matches": [ "address", "value" ] 
    }
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

var parseSegaSaturn = function parseSegaSaturn(code) {
    var type = code.match(/([0-9a-f]{1})/i)[1];
    var response = processOP(type, code);
    return response;
};

module.exports = {
    "name": "segasaturn",
    "fn":   parseSegaSaturn
};
