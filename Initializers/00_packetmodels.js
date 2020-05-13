var Parser = require('binary-parser').Parser;
var stringOptions = {length: 99, zeroTerminated: true};

module.exports = PacketModels = {
    header: new Parser().skip(1)
        .string("command", stringOptions),
    
    login: new Parser().skip(1)
        .string("command", stringOptions)
        .string("username", stringOptions)
        .string("password", stringOptions),
    
    register: new Parser().skip(1)
        .string("command", stringOptions)
        .string("username", stringOptions)
        .string("password", stringOptions),
    
    pos: new Parser().skip(1)
        .string("command", stringOptions)
        .int32le("target_x", stringOptions)
        .int32le("target_y", stringOptions),
    
    warp: new Parser().skip(1)
        .string("command", stringOptions)
        .string("target_room", stringOptions)
};

