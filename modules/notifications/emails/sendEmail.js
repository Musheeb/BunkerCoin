const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');


const sendEmail = async (recipient, mailBody, templateName) => {
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

    console.log(process.cwd())
    

        // Load and compile the Handlebars template
        const templatePath = path.resolve(process.cwd(), 'templates', `${templateName}.handlebars`);
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateSource);
    
        // Generate the email body using the template
        const html = template(mailBody.context);
    
        // Use a template file with nodemailer
       // transporter.use('compile', handlebars(handlebarOptions));

    const recipientEmail = recipient;

   // Create email body
   const mailOptions = {
    from: process.env.SES_FROM || 'museebnoorisys240@gmail.com',
    to: recipientEmail,
    subject: mailBody.subject,
    html: html,
    context: mailBody.context // Pass variables to the template
};

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