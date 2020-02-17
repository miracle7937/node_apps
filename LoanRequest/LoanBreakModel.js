var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	loanID: { required: true, type: String },
	email: { required: true, type: String },
	paymentType: { required: true, type: String },
	BreakDown: [
		{
			date_of_payment: { type: Date, required: true },
			amount: { type: Number, required: true },
			Paymentstatus: { type: Boolean, default: false }
		}
	]
});

module.exports = mongoose.model('Breakdown', schema);
