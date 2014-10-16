"use strict";

var utils = require("../lib/utils");

var OPS = {
    "80": {
        "OP": "8CW",
        "regex": /80([0-9a-f]{6})\s?00([0-9a-f]{2})/i,
        "matches": [ "address", "value" ]
    },
    "81": {
        "OP": "16CW",
        "regex": /81([0-9a-f]{6})\s?([0-9a-f]{4})/i,
        "matches": [ "address", "value" ]
    },
    "A0": {
        "OP": "8UW",
        "regex": /A0([0-9a-f]{6})\s?00([0-9a-f]{2})/i,
        "matches": [ "address", "value" ]
    },
    "A1": {
        "OP": "16UW",
        "regex": /A1([0-9a-f]{6})\s?([0-9a-f]{4})/i,
        "matches": [ "address", "value" ]
    },
    "88": {
        "OP": "8GS",
        "regex": /88([0-9a-f]{6})\s?00([0-9a-f]{2})/i,
        "matches": [ "address", "value" ]
    },
    "89": {
        "OP": "16GS",
        "regex": /89([0-9a-f]{6})\s?([0-9a-f]{4})/i,
        "matches": [ "address", "value" ]
    },
    "D0": {
        "OP": "8EQ",
        "fn": function(type, code, response) {
            var m = utils.match(code, /D0([0-9a-f]{6})\s?00([0-9a-f]{2})\n(.+)\n?/i);
            if(!m) return;
            utils.addTo(response.data, "address", m[0]);
            utils.addTo(response.data, "value",   m[1]);
            var cType = m[2].match(/^(..)/)[1];
            utils.addTo(response.data, "code", processOP(cType, m[2]));
        }
    },
    "D1": {
        "OP": "16EQ",
        "fn": function(type, code, response) {
            var m = utils.match(code, /D1([0-9a-f]{6})\s?([0-9a-f]{4})\n(.+)\n?/i);
            if(!m) return;
            utils.addTo(response.data, "address", m[0]);
            utils.addTo(response.data, "value",   m[1]);
            var cType = m[2].match(/^(..)/)[1];
            utils.addTo(response.data, "code", processOP(cType, m[2]));
        }
    },
    "D2": {
        "OP": "8NEQ",
        "fn": function(type, code, response) {
            var m = utils.match(code, /D2([0-9a-f]{6})\s?00([0-9a-f]{2})\n(.+)\n?/i);
            if(!m) return;
            utils.addTo(response.data, "address", m[0]);
            utils.addTo(response.data, "value",   m[1]);
            var cType = m[2].match(/^(..)/)[1];
            utils.addTo(response.data, "code", processOP(cType, m[2]));
        }
    },
    "D3": {
        "OP": "16NEQ",
        "fn": function(type, code, response) {
            var m = utils.match(code, /D3([0-9a-f]{6})\s?([0-9a-f]{4})\n(.+)\n?/i);
            if(!m) return;
            utils.addTo(response.data, "address", m[0]);
            utils.addTo(response.data, "value",   m[1]);
            var cType = m[2].match(/^(..)/)[1];
            utils.addTo(response.data, "code", processOP(cType, m[2]));
        }
    },
    "EE": {
        "OP": "DEP",
        "regex": /EE0{6}\s?0{4}/,
        "matches": []
    },
    "DD": {
        "OP": "DEP2",
        "regex": /DD0{6}\s?0{4}/,
        "matches": []
    },
    "CC": {
        "OP": "DEP3",
        "regex": /CC0{6}\s?0{4}/,
        "matches": []
    },
    "DE": {
        "OP": "EC",
        "regex": /DE([0-9a-f]{6})\s0{4}/i,
        "matches": [ "address" ]
    },
    "F0": {
        "OP": "8WO",
        "regex": /F0([0-9a-f]{6})\s?00([0-9a-f]{2})/i,
        "matches": [ "address", "value" ]
    },
    "F1": {
        "OP": "16WO",
        "regex": /F1([0-9a-f]{6})\s?([0-9a-f]{4})/i,
        "matches": [ "address", "value" ]
    },
    "FF": {
        "OP": "SSL",
        "regex": /FF([0-9a-f]{6})\s?0{4}/i,
        "matches": [ "address" ]
    },
    "50": {
        "OP": "PC",
        "regex": /5000([0-9a-f]{2})([0-9a-f]{2})\s?00([0-9a-f]{2})\n([0-9a-f]{6})\s?([0-9a-f]{4})/i,
        "matches": [ "number", "offset", "address", "add" ]
    }
};

var activators = {
    "NONE":   0x00,
    "DRIGHT": 0x01,
    "DLEFT":  0x02,
    "DDOWN":  0x04,
    "DUP":    0x08,
    "START":  0x10,
    "Z":      0x20,
    "B":      0x40,
    "A":      0x80,
    "CRIGHT": 0x01,
    "CLEFT":  0x02,
    "CDOWN":  0x04,
    "CUP":    0x08,
    "R":      0x10,
    "L":      0x20
};

var encryptCode = function encryptCode(code) {

    var bytes = utils.toBytes(code).map(utils.fromHex);

    /* A0 */ bytes[0] = (bytes[0] ^ 0x68);
    /* A1 */ bytes[1] = (bytes[1] ^ 0x81) - 0x2B;
    /* A2 */ bytes[2] = (bytes[2] ^ 0x82) - 0x2B;
    /* A3 */ bytes[3] = (bytes[3] ^ 0x83) - 0x2B;
    /* D0 */ bytes[4] = (bytes[4] ^ 0x84) - 0x2B;
    /* D1 */ bytes[5] = (bytes[5] ^ 0x85) - 0x2B;

    return bytes.map(utils.toHex).join("");  

};

var decryptCode = function decryptCode(code) {

    var bytes = utils.toBytes(code).map(utils.fromHex);

    /* A0 */ bytes[0] = (bytes[0] ^ 0x68);
    /* A1 */ bytes[1] = (bytes[1] + 0x2B) ^ 0x81;
    /* A2 */ bytes[2] = (bytes[2] + 0x2B) ^ 0x82;
    /* A3 */ bytes[3] = (bytes[3] + 0x2B) ^ 0x83;
    /* D0 */ bytes[4] = (bytes[4] + 0x2B) ^ 0x84;
    /* D1 */ bytes[5] = (bytes[5] + 0x2B) ^ 0x85;

    return bytes.map(utils.toHex).join("");  

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

var parseN64 = function parseN64(code) {
    var type = code.match(/([0-9a-f]{2})/i)[1];
    var response = processOP(type, code);
    return response;
};

parseN64.encrypt = encryptCode;
parseN64.decrypt = decryptCode;

module.exports = {
    "name": "n64",
    "fn":   parseN64
};
