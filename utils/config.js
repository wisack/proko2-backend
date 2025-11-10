require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
const RATELIMITERS = process.env?.RATELIMITERS === "off" ? false : true
const FEEDBACKLIMIT = process.env?.FEEDBACKLIMIT
const SLOWDOWNAFTER = process.env?.SLOWDOWNAFTER

const MONGOCONFIG = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
};

if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

const tokenOptions = {
  expiresIn: process.env.TOKENMINUTES * 60 || 60 * 60
}
/* deprecate expiresIn
const palauteTokenOptions = {
  expiresIn: process.env.PALAUTETOKENMINUTES * 60 || 20 * 60
}
*/
const BASEPASSWORD = process.env.BASEPASSWORD || "password123"

const textFieldSizes = {
  headerLength: 50,
  maxTopicCount: 30,
  smallTextfield: 500,
  interMediateTextfield: 1000,
  mediumTextfield: 3000,
  largeTextfield: 5000
}
const groupLimits = {
    maxNameLength: 50,
    maxStudentCount: 50    
}

module.exports = {
    MONGODB_URI,
    PORT,
    tokenOptions,
    MONGOCONFIG,
    textFieldSizes,
    //palauteTokenOptions,
    RATELIMITERS,
    FEEDBACKLIMIT,
    BASEPASSWORD,
    SLOWDOWNAFTER,
    groupLimits,
}
