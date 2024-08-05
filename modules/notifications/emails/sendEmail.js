const nodemailer = require('nodemailer');

const sendEmail = async (recipient) => {
    //Configure SMTP with nodemailer.
    const transporter = nodemailer.createTransport({
        host: process.env.SES_HOST || "email-smtp.eu-central-1.amazonaws.com",
        port: process.env.SES_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SES_USERNAME || "AKIA4MTWJ5NESULE3PEI",
            pass: process.env.SES_PASSWORD || "BOI+2xUhe4cuXANFEkWh77rnCIU1qcJAmE9OuRJ1ye+K"
        }
    });

    const recipientEmail = recipient;

    //Create email body.
    const mailOptions = {
        from: process.env.SES_FROM || 'museebnoorisys240@gmail.com',
        to: recipientEmail,
        subject: "This is subject field",
        text: "This is body"
    }

    //send Email.
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("SES failed. Error:- ", error);
        } else {
            console.log("Email sent: ", info.response)
        }
    });
};
// sendEmail();
exports.sendEmail = sendEmail;