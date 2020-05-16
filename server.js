'use strict';
require(__dirname + '/Resource/config.js');
var fs = require('fs');
var net = require('net');
var path = require('path');
require('./packet.js');

// Load init
var init_files = fs.readdirSync(__dirname + "/Initializers");
init_files.forEach(function(initFile) {
    console.log('Loading initializer '+ initFile);
    require(path.join(__dirname, "Initializers", initFile));
});

// Load models
var model_files = fs.readdirSync(path.join(__dirname, "Models"));
model_files.forEach(function(modelFile) {
    console.log('Loading model '+ modelFile);
    require(path.join(__dirname, "Models", modelFile));
});

// Load maps
global.maps = {};
var map_files = fs.readdirSync(config.data_paths.maps);
map_files.forEach(function(mapFile) {
    console.log('Loading map ', mapFile);
    var map = require(path.join(config.data_paths.maps, mapFile));
    maps[map.id] = map;
});

// Create server
net.createServer(function(socket) {

    console.log("Socket connected.");
    var client_inst = new require('./client.js');
    var c = new client_inst;

    c.socket = socket;
    c.initiate();

    socket.on('err', c.error);

    socket.on('end', c.end);

    socket.on('data', c.data);
}).listen(config.port); // Start server

console.log("Initializing complete.");
console.log("Server running on port " + config.port);
console.log("Environment: " + config.environment);