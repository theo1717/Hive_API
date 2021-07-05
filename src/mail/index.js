const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hivetechcompany@gmail.com",
    pass: "e1e2c3f4l5t6@798"
  }
});

module.exports = transporter;
