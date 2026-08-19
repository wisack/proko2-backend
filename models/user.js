const mongoose = require('mongoose')

const userKoulutusSchema = new mongoose.Schema({
  koulutusId: { type: mongoose.Schema.Types.ObjectId, ref: 'Koulutusinfo.koulutukset' }, 
  tapahtuma: String,
  laskutus: Number,
  actualizedBilling: Number,
});

const userSchema = mongoose.Schema({
  science: String,
  username: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: String,
  role: {
    type: String,
    enum: ['pro', 'superpro', 'fmpro', 'admin', 'kummi']
  },
  group: String,
  language: {
    type: String,
    default: "fi"
  },
  special: {
    type: String,
    default: ""
  },
  intScience : {
    type: String,
    default: ""
  },
  planning: {
    type: Number,
    default: 0
  },
  koulutukset: [userKoulutusSchema],
  suunnitelma: {
    type: String
  },
  logins: {
    type: Number,
    default: 0
  }

})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User