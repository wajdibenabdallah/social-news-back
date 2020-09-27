import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import expReg from '../shared/regex';

let userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  phone: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  hash: String,
  salt: String,
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.validPassword = function (password) {
  return (
    this.hash ===
    crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
  );
};

userSchema.methods.generateJwt = function () {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.SECRET
  );
};

userSchema.methods.validateData = (user) => {
  if (
    !user.firstName ||
    expReg.HAS_SPECIAL_CARACTER.test(user.firstName) ||
    user.firstName?.length > 20 ||
    user.firstName?.length < 5
  )
    return `Firstname invalid`;
  if (
    !user.lastName ||
    expReg.HAS_SPECIAL_CARACTER.test(user.lastName) ||
    user.lastName?.length > 20 ||
    user.lastName?.length < 5
  )
    return `Lastname invalid`;
  if (!user.email || !expReg.IS_EMAIL.test(user.email)) return `Email invalid`;
  if (!user.phone || !expReg.IS_PHONE_NUMBER.test(user.phone))
    return `Phone invalid`;
  if (!user.password || user.password?.length < 8) return `Password invalid`;
  if (user?.confirmPassword !== user?.password)
    return `Password confirmation invalid`;

  return null;
};

export default mongoose.model('User', userSchema);
