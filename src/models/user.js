import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import * as EXP_REG from '../shared/regex';

let userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  phone: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.validPassword = function(password) {
  return (
    this.hash ===
    crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
  );
};

userSchema.methods.generateJwt = function() {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      exp: parseInt(expiry.getTime() / 1000)
    },
    process.env.SECRET
  );
};

userSchema.methods.validateData = user => {
  isValidFullName(user.firstname, user.lastname);
};

let isValidFullName = (firstname, lastname) => {
  if (
    EXP_REG.hasSpecialCaracter(firstname) ||
    EXP_REG.hasSpecialCaracter(lastname) ||
    EXP_REG.hasNumbers(firstname) ||
    EXP_REG.hasNumbers(lastname) ||
    !firstname?.isLengthAuthorized(3, 20) ||
    !lastname?.isLengthAuthorized(3, 20)
  ) {
    console.log('fail');
  }
};

export default mongoose.model('User', userSchema);
