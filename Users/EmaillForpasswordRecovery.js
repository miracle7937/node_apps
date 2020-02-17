const nodemailer = require('nodemailer');
const express = require('express');
const UserAuth = require('./userModel');

const router = express.Router();
const crypto = require('crypto');
const async = require('async');
const bcrypt = require('bcrypt');

router.post('/forget', function(req, res, next) {
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			console.log(token + 'my token');
			UserAuth.findOne({ email: req.body.email }, function(err, user) {
				if (!user) {
					res.json({
						message: 'No account with that email address exists.'
					});
					// req.flash('error', 'No account with that email address exists.');
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				user.save(function(err) {
					done(err, token, user);
				});
			});
		},
		function(token, user, done) {
			console.log(user);
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'Ebukamiracle45@gmail.com',
					pass: '08168307987'
				}
			});
			console.log('http://' + req.headers.host + '/email' + '/reset/' + token);
			var mailOptions = {
				to: user.email,
				from: 'Ebukamiracle45@gmail.com',
				subject: 'Node.js Password Reset',
				text:
					'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://' +
					req.headers.host +
					'/email' +
					'/reset/' +
					token +
					'\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				console.log(err);
				// req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				res.status(200).json({
					message: "success', An e-mail has been sent to " + user.email + ' with further instructions.'
				});
			});
		}
	]);
});

router.get('/reset/:token', function(req, res) {
	UserAuth.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(
		err,
		user
	) {
		if (user) {
			console.log(user.email);
			res.render('test', { email: user.email });

			console.log('user not found');
		} else if (err) {
			res.render('dynamicPage', { title: 'Error Message', body: 'user not found or the token has expired' });
		}
		res.render('dynamicPage', { title: 'Error Message', body: 'user not found or the token has expired' });
	});
});

// router.post('/reset/:token', function(req, res) {
// 	async.waterfall(
// 	     	[
// 			function(done) {
// 				UserAuth.findOne(
// 					{ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
// 					function(err, user) {
// 						if (!user) {
// 							req.flash('error', 'Password reset token is invalid or has expired.');
// 							return res.redirect('back');
// 						}
// 						if (req.body.password === req.body.confirm) {
// 							user.setPassword(req.body.password, function(err) {
// 								user.resetPasswordToken = undefined;
// 								user.resetPasswordExpires = undefined;

// 								user.save(function(err) {
// 									req.logIn(user, function(err) {
// 										done(err, user);
// 									});
// 								});
// 							});
// 						} else {
// 							req.flash('error', 'Passwords do not match.');
// 							return res.redirect('back');
// 						}
// 					}
// 				);
// 			},
// 			function(user, done) {
// 				var smtpTransport = nodemailer.createTransport({
// 					service: 'Gmail',
// 					auth: {
// 						user: 'learntocodeinfo@gmail.com',
// 						pass: process.env.GMAILPW
// 					}
// 				});
// 				var mailOptions = {
// 					to: user.email,
// 					from: 'learntocodeinfo@mail.com',
// 					subject: 'Your password has been changed',
// 					text:
// 						'Hello,\n\n' +
// 						'This is a confirmation that the password for your account ' +
// 						user.email +
// 						' has just been changed.\n'
// 				};
// 				smtpTransport.sendMail(mailOptions, function(err) {
// 					req.flash('success', 'Success! Your password has been changed.');
// 					done(err);
// 				});
// 			}
// 		],

// 	);
// });

// update password or user
router.post('/update_password/:email', (req, res) => {
	var pass = req.body.post;

	if (pass.password1 === pass.password2) {
		const hash = bcrypt.hashSync(pass.password1, 10);
		UserAuth.updateOne(
			{ email: req.params.email },
			{
				$set: {
					password: hash
				}
			}
		).then((result) => {
			// this were i will send an email for message sent
			message(req.params.email);
			res.render('dynamicPage', {
				title: 'Password Reset Successesful',
				body: 'your password for SmartLoan have been successully updated'
			});
		});
	} else {
		res.render('dynamicPage', {
			title: 'Error Message',
			body: 'your password for SmartLoan have not  been changed '
		});
	}
});


var message = function(email) {
	var smtpTransport = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'Ebukamiracle45@gmail.com',
			pass: '08168307987'
		}
	});
	var mailOptions = {
		to: email,
		from: 'Ebukamiracle45@gmail.com',
		subject: 'Your password has been changed',
		text:
			'Hello,\n\n' +
			'This is a confirmation that the password for your account ' +
			email +
			' has just been changed.\n'
	};
	smtpTransport.sendMail(mailOptions, function(err) {
		// req.flash('success', 'Success! Your password has been changed.');
	});
};

module.exports = router;
