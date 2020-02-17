var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    userName: String,
	email: { type: String, unique: true, required: true },
	referalID: String,
	date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('referalTable', schema);
