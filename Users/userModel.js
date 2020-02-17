var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	userName: String,
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	matricNumber: { type: String, required: true },
	phoneNumber: Number,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	referralID: String,
	
});

module.exports = mongoose.model('UserAuth', schema);
