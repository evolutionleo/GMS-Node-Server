
var zeroBuffer = Buffer.alloc(1, '00', 'hex');

module.exports = packet = {

    // params = array of json's
    build: function(params) {
        var packSize = 0;
        var packParts = []; // Array of buffers

        params.forEach(function(param) {

            if(typeof param === 'string') {
                buffer = Buffer.alloc(param.length, param, 'utf-8');
                buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1);
                //console.log('Packing String: ' + param);
            }
            else if(typeof param === 'number') {
                buffer = Buffer.alloc(4);
                buffer.writeInt32LE(param);
                //console.log('Packing Number: ' + param);
            }
            else {
                console.log('WARNING: Unknown data type in packet builder!');
            }

            packSize += buffer.length;
            packParts.push(buffer);
        });

        var dataBuffer = Buffer.concat(packParts, packSize);

        var sizeBuffer = Buffer.alloc(1, dataBuffer.length);


        var finalPack = Buffer.concat([sizeBuffer, dataBuffer], dataBuffer.length + sizeBuffer.length);

        return finalPack;
    },

    parse: function(c, data) {
        var idx = 0;
        while(idx < data.length) {

            var packSize = data.readUInt8(idx);
            var extractedPack = Buffer.alloc(packSize);
            data.copy(extractedPack, 0, idx, idx+packSize);


            this.interpret(c, extractedPack);

            idx += packSize;
        }
    },

    interpret: function(c, datapack) {
        var header = PacketModels.header.parse(datapack);

        //console.log("Interpret: "+header.command);

        switch(header.command.toUpperCase()) {
            case "LOGIN":

                var data = PacketModels.login.parse(datapack);

                User.login(data.username, data.password, function(result, user) {

                    console.log("Logging in..."); // Debug

                    console.log("Login result: "+result);

                    if(result) {
                        c.user = user;
                        c.socket.write(packet.build(["LOGIN", "TRUE", c.user.current_room, c.user.pos_x, c.user.pos_y, c.user.username]));

                        c.enterRoom(c.user.current_room);
                    }
                    else {
                        c.socket.write(packet.build(["LOGIN", "FALSE"]));
                    }

                    console.log("Login ended.");
                });
                break;
            case "REGISTER":
                var data = PacketModels.register.parse(datapack);
                User.register(data.username, data.password, function(result) {
                    console.log("Registering...");

                    if(result) {
                        console.log("Registration Successful!");
                        c.socket.write(packet.build(["REGISTER", "TRUE"]));
                    }
                    else {
                        console.log("Registration Failed!");
                        c.socket.write(packet.build(["REGISTER", "FALSE"]));
                    }

                    //console.log("Registration ended.");
                });
                break;
            case "POS":
                var data = PacketModels.pos.parse(datapack);
                c.user.pos_x = data.target_x;
                c.user.pos_y = data.target_y;
                //c.user.save();
                c.broadcastRoom(packet.build(["POS", c.user.username, data.target_x, data.target_y]));

                //console.log(data);
                break;
            case "WARP":
                var data = PacketModels.warp.parse(datapack);

                console.log("Target room: "+data.target_room);

                var pos_x = maps[data.target_room].start_x;
                var pos_y = maps[data.target_room].start_y;


                c.leaveRoom(c.user.current_room);
                c.user.current_room = data.target_room;
                c.enterRoom(data.target_room);

                //c.broadcastRoom(packet.build(["POS", c.user.username, pos_x, pos_y]));

                c.socket.write(packet.build(["WARP", c.user.current_room, pos_x, pos_y]));
                break;
        }
    }
};