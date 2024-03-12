import {
    response_200,
    response_500,
} from '../utils/responseCodes.js';
import Form from '../models/form.model.js';
import nodemailer from 'nodemailer';
import User from '../models/user.model.js';

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    post: 587,
    security: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})




export async function pendingPasses(req, res) {
    Form.find({ isAccepted: null })
        .then((finalResult) => {
            return response_200(res, 'Fetched all pending outpasses!!', finalResult);
        }).catch(error => { return response_500(res, 'Internal server error', error); });

}

export async function outpass(req, res) {
    const id = req.body.id;
    const status = req.body.status;
    const reason = status ? null : req.body.reason;
    const otp = Math.floor(Math.random() * 900000) + 100000;
    
    Form.findByIdAndUpdate(id, { $set: { isAccepted: status, otp: status ? otp : null, rejectReason: status ? null : reason } }, { new: true })
        .then((result) => {
            User.findOne({ email: result.roll + "@iiita.ac.in" })
            .then((finalResult) => {
                var name = finalResult.name
                var message = status ? `Dear ${name}, your outpass has been approved! Use ${otp} as your otp to get the hell out of here` : `Oops!! ${name}, your outpass have been declined due to the following reason :- \n ${reason} \n. Please contact your respective caretaker/warden for queries.`

                var senderEmail = 'oshankipriya1@gmail.com'

                var mailOptions = {
                    from: 'Warden GH',
                    to: finalResult.email,
                    subject: status ? "Outpass Approved" : "Outpass Declined",
                    replyTo: senderEmail,
                    html: `${message} <br><br> From:${senderEmail}`
                }

                transporter.sendMail(mailOptions, (err, data) => {
                    if (err) { return response_500(res, 'Internal server error', err); }
                    else {
                        res.json({
                            status: "success"
                        })
                        console.log("email sent " + data.response)
                    }
                })

                return response_200(res, status ? 'Outpass Approved! OTP sent!' : 'Outpass declined! mail sent!');
            })
        }).catch(error => { return response_500(res, 'Internal server error', error); });

}

export async function acceptedPasses(req, res) {
    Form.find({ isAccepted: true })
        .then((finalResult) => {
            return response_200(res, 'Fetched all accepted outpasses!!', finalResult);
        }).catch(error => { return response_500(res, 'Internal server error', error); });
}

export async function rejectedPasses(req, res) {
    Form.find({ isAccepted: false })
        .then((finalResult) => {
            console.log(finalResult);
            return response_200(res, 'Fetched all rejected outpasses!!', finalResult);
        }).catch(error => { return response_500(res, 'Internal server error', error); });

}

transporter.verify(function (err, success) {
    if (err) {
        console.log(err);
    } else {
        console.log("Server is ready to send emails")
    }

});
