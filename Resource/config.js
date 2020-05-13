// Import
var args = require('minimist')(process.argv.slice(2));
var extend = require('extend');
var path = require('path');

// Store environment
var environment = args.env || "debug";

// Common config
var common_conf = {
    name: "mmo_server1337",
    version: "0.0.1",
    environment: environment,
    max_players: 100,
    data_paths: {
        items:  path.join(__dirname, 'Game Data', 'Items'),
        maps: path.join(__dirname, 'Game Data', 'Maps')
    },
    /*starting_zone: {
        room: "rMapHome"
    }*/
    starting_zone: "rMapHome"
};

var conf = {
    production: {
        ip: args.ip || "0.0.0.0",
        port: args.port || 1337,
        //database: "mongodb://127.0.0.1/mmo_prod"
        database: "mongodb+srv://node:record56@mmo-5otrs.mongodb.net/test?retryWrites=true&w=majority"
    },
    debug: {
        ip: args.ip || "0.0.0.0",
        port: args.port || 1338,
        //database: "mongodb://127.0.0.1/mmo_debug"
        database: "mongodb+srv://node:record56@mmo-5otrs.mongodb.net/test?retryWrites=true&w=majority"
    }
};

extend(false, conf.production, common_conf);
extend(false, conf.debug, common_conf);


module.exports = config = conf[environment];

//console.log(environment);