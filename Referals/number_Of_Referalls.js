const express = require('express');

const ReferalTable = require('./referalsModel');

const router = express.Router();

router.post('/numbersOfReferral', (req, res) => {
	ReferalTable.find({
		referalID: req.body.referalID
	}).then((result) => {


        // i dont know what to dent to the
    });
});

module.exports = router;
