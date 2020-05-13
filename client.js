// Client handled
var now = require('performance-now');
var _ = require('underscore');

module.exports = function() {
    var client = this;

    // Will be added on runtime:
    //this.socket = {}
    //this.user = {}
    this.enterRoom = function(room) {
        maps[room].clients.forEach(function(otherClient) {
            otherClient.socket.write(packet.build(["ENTER", client.user.username, client.user.pos_x, client.user.pos_y]));

            if(client.user.username != otherClient.user.username)
                client.socket.write(packet.build(["POS", otherClient.user.username, otherClient.user.pos_x, otherClient.user.pos_y]));
        });

        maps[room].clients.push(client);
    };
    this.leaveRoom = function(room) {
        var idx = maps[room].clients.findIndex(function(element, index) {
            if(element == client) { return true; }
            else { return false; }
        });

        maps[room].clients.splice(idx, 1);
    };
    this.broadcastRoom = function(packData) {
        maps[client.user.current_room].clients.forEach(function(otherClient) {
            if(otherClient.user.username != client.user.username) { 
                otherClient.socket.write(packData);
            }
        });
    };
    this.initiate = function() {

        // Send the greetings
        client.socket.write(packet.build(["HELLO", now().toString()]));

        console.log("Client initiated.");
    };
 
    this.data = function(data) {
        //console.log("Socket data arrived: " + data.toString() + ".");

        packet.parse(client, data);
    };

    this.error = function(err) {
        console.log("Socket error: " + err.toString() + ".");
    };

    this.end = function() {
        client.user.save();
        client.leaveRoom(client.user.current_room);
        //client.user.close();
        console.log("Socket ended.");
    };
}