const express = require('express');
const mongoose = require('mongoose');
const AuthRoute = require('./Users/phoneAuth');
const userAuthRoute = require('./Users/userAuth');
const emailRoute = require('./Users/EmaillForpasswordRecovery');
const path = require('path');
const loanRequest = require('./LoanRequest/Loan_Request');
const userInfoPost = require('./LoanRequest/SaveRequestForLoan');

//for messageing Auth
const app = express();

//use ejs-template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Static folder

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//login Route
app.use('/user', userAuthRoute);
app.use('/verify', AuthRoute);
app.use('/email', emailRoute);
app.use('/requestloan', loanRequest);
app.use('/useInfo_forLoan', userInfoPost);

//error handling
app.use((req, res) => {
	res.json({
		message: 'page not found'
	});
});

const port = process.env.PORT || 800;
//for number verification

//    "mongodb://Miracle:4hrZlimYiuxGAMk1@cluster0-shard-00-00-rz247.mongodb.net:27017,cluster0-shard-00-01-rz247.mongodb.net:27017,cluster0-shard-00-02-rz247.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
// '//mongodb://localhost:27017/smartLoan'
mongoose.connect(
	'mongodb://Miracle:4hrZlimYiuxGAMk1@cluster0-shard-00-00-rz247.mongodb.net:27017,cluster0-shard-00-01-rz247.mongodb.net:27017,cluster0-shard-00-02-rz247.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	},
	() => {
		console.log('connect to mogoDb');
	}
);

if (process.env.NODE_ENV === 'Production') {
	console.log('poduction');
}

app.listen(port, () => {
	console.log('listing to port 800');
});
