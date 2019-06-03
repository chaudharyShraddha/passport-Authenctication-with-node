const mongoose = require("mongoose");

let schema = mongoose.Schema;

let userSchema = new schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    pass: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", userSchema);