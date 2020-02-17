const express = require('express');
const UserAuth = require('./userModel');
const bcrypt = require('bcryptjs');
const router = express.Router();
const nodemailer = require('nodemailer');
const id = require('shortid');
const referralTable = require('../Referals/referalsModel');
//getting user from DataBase

router.post('/login', async (req, res) => {
	console.log(req.body.email);
	UserAuth.findOne({ email: req.body.email })
		.then((result) => {
			console.log(result);
			if (result == null) {
				res.status(200).json({
					message: 'User not found'
				});
			} else {
				var isUser = bcrypt.compareSync(req.body.password, result.password);

				if (isUser) {
					res.status(200).json({
						message: 'User Authenticated',
						data: result
					});
				} else {
					res.status(200).json({
						message: 'User Authenticaton failed'
					});
				}
			}
		})
		.catch((err) => {
			res.json({
				message: err.message
			});
		});
});

//create a user
router.post('/', (req, res) => {
	//checking if the user exist in the dataBase before creating a new user
	UserAuth.findOne({ email: req.body.email })
		.then((result) => {
			if (result == null) {
				//new instance of referal
				

				console.log(req.body.password);
				// hashing password before saving it

				const hash = bcrypt.hashSync(req.body.password, 10);
				console.log(hash);

				const savedUser = new UserAuth({
					userName: req.body.userName,
					email: req.body.email,
					password: hash,
					matricNumber: req.body.matricNumber,
					phoneNumber: req.body.phoneNumber,
					// referralID: id.generate()
				});

				//getting the referall of the newly registered member

				savedUser
					.save()
					.then((result) => {
						//saveing the referal after user is saved
						// newRefeal.save();

						res.status(200).json({
							message: 'registration Successful',
							isSuccessful: true
						});
					})
					.catch((err) => {
						res.json({
							message: err.message
						});
					});
			} else {
				res.status(200).json({
					message: 'User already exit'
				});
			}
		})
		.catch((err) => {
			res.status(200).json({
				message: err.message
			});
		});
});

//recover user account
router.post('/recoverPassword', (req, res, next) => {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		Auth: {
			user: 'ebukamiarcle35@gmail.com',
			pass: '07035076005'
		}
	});

	//step 2
	let mailOption = {
		from: 'ebukamiracle45@gmail.com',
		to: req.body.password,
		subject: 'Texting and Texting',

		Text: 'It work'
	};

	//step3
	transporter.sendMail(mailOption, (err, data) => {
		if (err) {
			console.log('error occured' + err);
		} else {
			console.log('message sent');
		}
	});
	// bcrypt.hash(req.body.password, saltRound, (err, hash) => {
	// 	if (err) return res.status(401).json({ message: err });

	// DB.updateOne(
	//     { email: req.params.email },
	//     {
	//         $set: {
	//             password: hash
	//         }
	//     }
	// );
	// });
});

module.exports = router;
