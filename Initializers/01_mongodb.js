var mongoose = require("mongoose");
module.exports = gamedb = mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});