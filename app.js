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

const port = process.env.PORT || 800;
//for number verification

// mongodb+srv://Smartloan:Miracle_22@cluste1-pbedw.mongodb.net/test?retryWrites=true&w=majority

// '//mongodb://localhost:27017/smartLoan'

//https://still-river-80448.herokuapp.com/
//the url

mongoose.connect('mongodb+srv://smartloan:smartloan@cluster0-wbqho.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
	console.log('connect to mogoDb');
});

app.listen(port, () => {
	console.log('listing to port 800');
});
