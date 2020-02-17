var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	loanID: { required: true, type: String },
	requestedAmount: { required: true, type: Number },
	amountPayed: {  type: Number ,default:0}
});

module.exports = mongoose.model('payedLoan', schema);
