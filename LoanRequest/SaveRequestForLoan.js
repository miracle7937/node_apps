const DB = require('./Loan_Request_model');
const express = require('express');

var router = express.Router();
var multer = require('multer');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: 'code-freak',
	api_key: '342726524657322',
	api_secret: 'ffWRIUZZBs2xEbXqEqEcRnYSwGmA'
});

//uploading file to the inetrnet user files

//storage for the image file that gives a detail of where the file should be stored
var storage = multer.diskStorage({
	// destination: function(req, file, cb) {
	// 	cb(null, 'product_photo/');
	// },
	filename: function(req, file, cb) {
		var now = new Date();
		var str = now.toISOString();
		var res = str.replace(/\.[0-9]{3}/, '');
		var trimFilePath = file.fieldname + '_'  + file.originalname;

		cb(null, trimFilePath.replace(/ +/g, ''));
	},
	fileFilter: function(req, file, callback) {
		const isPhoto = file.mimetype.indexOf('image/') === 0;
		if (isPhoto) {
			callback(null, true); // true if valid
		} else {
			callback({ message: 'An optional error message' }, false); // false if invalid
		}
	}
});

//post user info the first is save
router.post('/userInfo1', (req, res) => {
	console.log(req.body.email);

	var saveData = new DB({
		email: req.body.email,
		userName: req.body.userName,
		gender: req.body.gender
	});

	saveData
		.save()
		.then((result) => {
			res.status(200).json({
				saved: true
			});
		})
		.catch((err) => {
			res.json(err);
		});
});

//Education information   of user note the number 2
router.post('/userInfo2', (req, res) => {
	const upload = multer({ storage: storage }).array('smartloans1', 2);

	upload(req, res, (err) => {
		const filePatha = new Array();
		console.log(req.files);
		if (err) {
			res.send({
				err: err,
				message: 'Fail to upload'
			});
		}

		req.files.map((userFile) => {
			// console.log(userFile.path)
			filePatha.push(userFile.path);
			cloudinary.uploader.upload(
				userFile.path,
				
				(err, image) => {
					if (err) return res.send(err);


					res.json(image)
				}
			);
		});
	});

	// var photos = req.files.map((mufile) => mufile.filename.trim());
	// console.log(photos);
	// DB.findOneAndUpdate(
	// 	{
	// 		email: req.body.email
	// 	},
	// 	{
	// 		$set: {
	// 			institutonName: req.body.institutonName,
	// 			institutionBankName: req.body.institutionBankName,
	// 			schoolAccount: req.body.schoolAccount,
	// 			course_of_study: req.body.course_of_study,
	// 			level: req.body.level
	// 		}
	// 	}
	// )
	// 	.then((result) => {
	// 		res.status(200).json({
	// 			saved: true
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		res.json(err);
	// 	});
});

//Contact information   of user note the number 3
router.post('/userInfo3', (req, res) => {
	DB.findOneAndUpdate(
		{
			email: req.body.email
		},
		{
			$set: {
				residential_address: req.body.residential_address,
				state: req.body.state,
				homeNumber: req.body.homeNumber
			}
		}
	)
		.then((result) => {
			res.status(200).json({
				saved: true
			});
		})
		.catch((err) => {
			res.json(err);
		});
});

// Guarantor Details information   of user note the number 3
router.post('/userInfo4', (req, res) => {
	DB.findOneAndUpdate(
		{
			email: req.body.email
		},
		{
			$set: {
				guarantor_name: req.body.guarantor_name,
				guarantor_phone: req.body.guarantor_phone,
				guarantor_occupation: req.body.guarantor_occupation,
				guarantor_address: req.body.guarantor_address
			}
		}
	)
		.then((result) => {
			res.status(200).json({
				saved: true
			});
		})
		.catch((err) => {
			res.json(err);
		});
});

router.post('/', (req, res) => {
	DB.findOne({
		email: req.body.email
	}).then((result) => {
		res.json(result);
	});
});

module.exports = router;
