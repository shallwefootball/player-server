const Chance = require('chance')
const nodemailer = require('nodemailer')
const chance = new Chance()

const config = require('../config')

// console.log('chance   : ', chance)

module.exports = (req, res) => {
  // console.log('req : ', req.body)
  sendEmail({
    email: req.body.email,
    token: chance.hash()
  })
  return res.json({message: 'success'})
}


const generateVerificationToken = () => {
  const token = chance.hash(); // 40 chars by default
  // this.verificationToken = token;
  // return this.save();
}

const sendEmail = ({email, token}) => {

  const transporter = nodemailer.createTransport(config.smtp);

  // setup e-mail data with unicode symbols
  const mailOptions = {
    from: '"Amos ⚽️" <amos@shallwefootball.com>',
    to: email,
    subject: 'sendToken  ✔',
    html: `
      <h2>hihi</h2>
      <a href="http://localhost:5000/?emailToken=${token}">http://localhost:5000/?emailToken=${token}</a>
    `
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}