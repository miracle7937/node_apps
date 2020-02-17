
const express = require('express');
const config = require('./config');
router = express.Router();
const client = require('twilio')(config.ACCOUNT_SID,config.AUTH_TOKEN )


router.post('/create', (req, res) => {
    if (req.body.phonenumber) {
        client
            .verify
            .services(config.SERVICE_ID)
            .verifications
            .create({
                to: `+${req.body.phonenumber}`,
                // channel: req.body.channel === 'call' ? 'call' : 'sms'
                channel:'sms'
            })
            .then(data => {
                res.status(200).json({
                    message: "Verification is sent!!",
                    phonenumber: req.body.phonenumber,
                    data
                })
            })
    } else {
        res.status(400).json({
            message: "Wrong phone number :(",
            phonenumber: req.body.phonenumber,
            data
        })
    }
})



// Verify Endpoint
router.post('/verify', (req, res) => {
    if (req.body.phonenumber && (req.body.code).length >=5) {
        client
            .verify
            .services(config.SERVICE_ID)
            .verificationChecks
            .create({
                to: `+${req.body.phonenumber}`,
                code: req.body.code
            })
            .then(data => {
                if (data.status === "approved") {
                    res.status(200).json({
                        message: "User is Verified!!",
                        data
                    })
                }
            })
    } else {
        res.status(400).json({
            message: "Wrong phone number or code :(",
            phonenumber: req.body.phonenumber,
            data
        });
    }
})


module.exports=router;