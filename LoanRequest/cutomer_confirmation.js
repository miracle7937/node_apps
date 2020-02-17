const breakDownDB = require('./LoanBreakModel');
const LoanPaid = require('./payedLoanModel');






// payment of loan in steps by users and updatin the week or month
module.exports = function(req,res) {
    this.req = req;
    this.res = res;

   
    this.cofirm =  () => {
        var response=this.res;
        var request = this.req;
   
    //dont forget to add to pass the amount paid
    //the _will be sent from the frontend
    //logic for the month do pay should be done on the front end
    //req.body.loanID
    //req.body.amount  amount we are paying per week
    let item = '5e3fa28ffdac9127d0d2c8ea'; //ths is the uniqe id for each breakdown loan which will be pass from the front end of the user 
       
    breakDownDB
        .updateOne(
            { loanID: request.body.loanID, 'BreakDown._id': item },
            {
                $set: {
                    'BreakDown.$.Paymentstatus': true
                }
            }
        )
        .then((result1) => {
            console.log(result1);
            if (result1.nModified === 1) {
                //update the payedloan table so to enable the user to request for another loan
                LoanPaid.findOne({ loanID: request.body.loanID }).then((result) => {
                    // console.log(result.amountPayed)

                    LoanPaid.updateOne(
                        { loanID: request.body.loanID },
                        {
                            $set: {
                                amountPayed: +result.amountPayed + +request.body.amount
                            }
                        }
                    ).then((result) => {
                        response.json({
                            title: 'Payment Successful',
                            message: result,
                            isSuccessesful: true


                        });
                    });
                });
            } else {
                response.json({
                    message: 'error the loan was not updated'
                });
            }
        })
        .catch((err) => {
            response.json(err);
        });
};
}

