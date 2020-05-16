var mongoose = require("mongoose");
module.exports = gamedb = mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
    function(err) {
        if(err) return console.log("Error connecting to db! "+err);
    }
);