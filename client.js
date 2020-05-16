// Client handled
var now = require('performance-now');
var _ = require('underscore');

module.exports = function() {
    var client = this;

    this.enterRoom = function(room) {
        
        maps[room].clients.forEach(function(otherClient) {
            if(client.user.username != otherClient.user.username) {
                //otherClient.socket.write(packet.build(["ENTER", client.user.username, client.user.pos_x, client.user.pos_y]));
                //client.socket.write(packet.build(["POS", otherClient.user.username, otherClient.user.pos_x, otherClient.user.pos_y]));
                //client.arr.push("POS", otherClient.user.username, otherClient.user.pos_x, otherClient.user.pos_y);
            }
        });

        client.broadcastRoom(packet.build([[8, cmd["POS"]], client.user.username, client.user.pos_x, client.user.pos_y]));
        

        //Add self to room's client list
        maps[room].clients.push(client);
    };
    this.leaveRoom = function(room) {
        var idx = maps[room].clients.findIndex(function(otherClient) {
            if(otherClient.user.username == client.user.username) { return true; }
            else { return false; }
        });

        // Delete self from previous room's client list
        maps[room].clients.splice(idx, 1);

        // And tell everyone we're leaving
        client.broadcastRoom(packet.build([[8, cmd["LEAVE"]], client.user.username]));
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
        client.socket.write(packet.build([[8, cmd["HELLO"]], now().toString()]));

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
        if(typeof client.user !== "undefined") {
            client.user.save(function(err) {
                if(err) return console.log("Error! Can't save: "+err);
            });
            client.leaveRoom(client.user.current_room);
        }
        //client.user.close();
        console.log("Socket ended.");
    };
}