var mongoose = require('mongoose');
var gamedb = require("mongoose");

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,

    sprite: String,

    current_room: Number,
    pos_x: Number,
    pos_y: Number
});

userSchema.statics.register = function(username, password, cb) {

    //console.log(maps); // Remove later!

    var newUser = new User({
        username: username,
        password: password,

        sprite: "sPlayer",

        current_room: maps[config.starting_zone].id,
        pos_x: maps[config.starting_zone].start_x,
        pos_y: maps[config.starting_zone].start_y
    });

    newUser.save(function(err) {
        if(!err) {
            cb(true);
        }
        else {
            cb(false);
        }
    });
}

userSchema.statics.login = function(username, password, cb) {
    User.findOne({username: username}, function(err, user) {
        if(!err && user) {
            if(user.password == password) {
                cb(true, user);
            }
            else {
                cb(false, null);
            }
        }
        else {
            cb(false, null);
        }
    });
}

module.exports = User = gamedb.model('User', userSchema);