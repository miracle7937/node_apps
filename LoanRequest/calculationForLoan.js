// const dateAdded = require('add-subtract-date');
const moment = require('moment');

/* where the loan break doen is done 
and updated in the database for the use
 to see his loan breakDown */
class CalLoan {
	constructor(amount, paymentMethod) {
		this.paymentMethod = paymentMethod;
		this.amount = amount;
	}

	calulate() {
		var loanBreackDown = [];

		if (this.paymentMethod == 'Monthly') {
			var totalPayable = +(this.amount * 0.1) + +this.amount;

			var monthlyPayable = totalPayable / 10;

			for (var i = 1; i <= 10; i++) {
				//monthly payment wil be spread aroud 10 months month

				var now = moment();

				now.add(i, 'months');

				loanBreackDown.push({
					date_of_payment: now,
					amount: Math.round(monthlyPayable),
					Paymentstatus: false
				});
			}
		} else {
			//weeks payment wil me smaller than ( 8 months) 28 weeks that a month
			var totalPayable = +(this.amount * 0.1) + +this.amount;

			var monthlyPayable = totalPayable / 28;

			for (var i = 1; i <= 28; i++) {
				var now = moment();

				now.add(i, 'weeks');

				loanBreackDown.push({
					date_of_payment: now,
					amount: Math.round(monthlyPayable),
					Paymentstatus: false
				});
			}
		}
		
		return loanBreackDown;
	}
}

module.exports = CalLoan;
