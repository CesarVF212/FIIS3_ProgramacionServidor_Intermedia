require("dotenv").config();

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { OAuth2 } = google.auth.OAuth2;

const createTransporter = async () => {

    const oauth2Client = new OAuth2(

        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI

    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject("Failed to create access token," + err);
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GMAIL_EMAIL,
            acessToken,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        }
    });

    return transporter;

};

const sendEmail = async (emailOptions) =>  {

    try {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.expors = {sendEmail};