var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	files: [String],
	gender: String,
	userName: String,
	payment: { type: Boolean, default: false },
	amount: { type: Number },
	paymentType: { type: String },
	loanType: { type: String },
	loanID: { type: String },
	email: { type: String },
	matricNumber: { type: String },
	institutonName: { type: String },
	institutionBankName: { type: String },
	course_of_study: { type: String },
	passportUrl: { type: String },
	admission_letter: { type: String },
	schoolAccount: { type: String },
	verify: { type: Boolean, default: false },
	date_of_request: { type: Date, default: Date.now },

	residential_address: String,
	state: String,
	homeNumber: String,
	guarantor_occupation: String,
	guarantor_phone: String,
	guarantor_name: String,
	guarantor_address: String
});

module.exports = mongoose.model('Loan_Request', schema);
