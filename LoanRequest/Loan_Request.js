const express = require('express');
const router = express.Router();
const id = require('shortid');
const LoanPaid = require('./payedLoanModel');

const DB = require('./Loan_Request_model');
const breakDownDB = require('./LoanBreakModel');
const Calc = require('./calculationForLoan');
const squareConnect = require('square-connect');

const accessToken = 'EAAAEL9PKhZfEqL1Yd1XIR_CofpY3b_tocc1mOkZVArU-gIveak3ZkUwTDzTj2_r';
const Confirm = require('./cutomer_confirmation');
//middle ware
const app = express();

// Set Square Connect credentials and environment
const defaultClient = squareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = accessToken;

// Set 'basePath' to switch between sandbox env and production env
// sandbox: https://connect.squareupsandbox.com
// production: https://connect.squareup.com
defaultClient.basePath = 'https://connect.squareupsandbox.com';

router.get('/', (req, res) => {
	LoanPaid.find().then((result) => {
		res.json(result);
	});
});
router.delete('/', (req, res) => {
	LoanPaid.remove().then(() => {
		console.log('deleted');
	});
});





// making request for loan router

router.post('/', (req, res) => {
	//request for a new loan de
	var savedData = new DB({
		amount: req.body.amount,
		paymentType: req.body.paymentType,
		loanType: req.body.loanType,
		loanID: 'loanID-' + id.generate(),
		email: req.body.email,
		matricNumber: req.body.matricNumber,
		institutonName: req.body.institutonName,
		course_of_study: req.body.course_of_study,
		passportUrl: req.body.passportUrl,
		admission_letter: req.body.admission_letter,
		schoolAccount: req.body.schoolAccount
	});

	savedData
		.save()
		.then(() => {
			res.status(200).json({
				message:
					'Your loan request was successfully, It will undergo verification. You will be hearing  from us soon ',
				successful: true
			});
		})
		.catch((err) => {
			res.json({
				message: err.message
			});
		});
});

/*admin block verify the person  ==> this route is were the admin after checking user document verifies the person for the loan*/

router.post('/verify', (req, res) => {
	//to check the amount the user have paid of the loan
	var paidLoan = new LoanPaid({
		loanID: req.body.loanID,
		requestedAmount: req.body.amount
	});
	//update the loan to true by the admin after verificaton
	DB.updateOne(
		{ loanID: req.body.loanID },
		{
			$set: {
				verify: true
			}
		}
	)
		.then(() => {
			//this is done so that one ca check if the user can request for another loan when he /she has payed for halve the amount

			paidLoan.save().then((result) => {
				res.json({
					message: 'account verified, waiting for payment'
				});
			});
		})
		.catch((err) => {
			res.json({
				message: err
			});
		});
});

/* Loan break down depending on the paymentType  selected by the user 

if it is  monthly spread around 10 month
if it is weeekly spread 52weeks that is a year.
the loan is at 10% pecent 
*/

//admin block
router.post('/payment', (req, res) => {
	const calculatedPayable = new Calc(req.body.amount, req.body.paymentType);

	var saveData = new breakDownDB({
		paymentType: req.body.paymentType,
		loanID: req.body.loanID,
		email: req.body.email,
		BreakDown: calculatedPayable.calulate()
	});

	// update the payment to true by the admin after payment
	DB.updateOne(
		{ loanID: req.body.loanID },
		{
			$set: {
				payment: true
			}
		}
	)
		.then((result) => {
			console.log(result);
			//saving the breakdown
			saveData
				.save()
				.then((result) => {
					res.json({
						message: 'payment successful check email for evidence of payment',
						breakdown: result
					});
				})
				.catch((err) => {
					res.json(err.message);
				});

			//when the payment is done immediate the breakdown dable is prepared
		})
		.catch((err) => {
			res.json({
				message: err.message
			});
		});
});

//test purposes
//getting all break down of user
router.get('/break', (req, res) => {
	breakDownDB.find().then((result) => {
		res.json(result);
	});
});

//user block gettin the break down of user
router.get('/userbreakdown', (req, res) => {
	breakDownDB
		.findOne({ loanID: req.body.loanID })
		.then((result) => {
			res.status(200).json({
				message: result
			});
		})
		.catch((err) => {
			res.json(err);
		});
});


//request of another loan by user if it return true the the cycle of loan will be repeated again

router.post('/requestanotherloan', (req, res) => {
	LoanPaid.findOne({ loanID: req.body.loanID }).then((result) => {
		var totalAmount = result.requestedAmount;
		var paidAmount = result.amountPayed;
		var percentPayed = Math.ceil(paidAmount / totalAmount * 100);

		if (percentPayed < 50) {
			res.status(200).json({
				message: 'you have to pay upto 50% of your outstanding loan to request for another loan',
				isQualified: false
			});
		} else {
			res.status(200).json({
				message: 'you are due for another loan',
				isQualified: true
			});
		}

		console.log(percentPayed);
	});
});

//to check if a user is qualifed to collect another loan

router.post('/process-payment', async (req, res) => {
	const request_params = req.body;

	// length of idempotency_key should be less than 45
	const idempotency_key = Date();

	// Charge the customer's card
	const payments_api = new squareConnect.PaymentsApi();
	const request_body = {
		source_id: request_params.nonce,
		amount_money: {
			amount: 100, // $1.00 charge
			currency: 'USD'
		},
		idempotency_key: idempotency_key
	};

	try {
		const response = await payments_api.createPayment(request_body);
//the if success full will be use tlo update the break down of the use account
//mock not correct need revisitng when the stuff is build


		var send = new Confirm(req, res); //it should be place in an if successful condition state mentnt 
		send.cofirm();
		
	} catch (error) {
		console.log('sad');
		app.use('/', customerConfirm);
		res.json({
			successful: false,
			'title': 'Payment Failure',
			'result': error.response.text
		});
	}
});
router.post('/help',(req,res)=>{
	
	
})

module.exports = router;
