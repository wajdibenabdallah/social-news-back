import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';
import expReg from '../shared/regex';

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          expReg.LENGHT(2, 20).test(value) &&
          !expReg.HAS_SPECIAL_CARACTER.test(value) &&
          !expReg.HAS_NUMBER.test(value),
        message: (props) => `${props.value} is not a valid firstname!`,
      },
    },
    lastname: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          expReg.LENGHT(2, 20).test(value) &&
          !expReg.HAS_SPECIAL_CARACTER.test(value) &&
          !expReg.HAS_NUMBER.test(value),
        message: (props) => `${props.value} is not a valid lastname!`,
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => expReg.IS_PHONE_NUMBER.test(value),
        message: (props) => `${props.value} is not a valid phone!`,
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (value) => expReg.IS_EMAIL.test(value),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    emailValid: {
      type: Boolean,
      default: false,
    },
    emailToken: {
      type: String,
      unique: true,
    },
    phoneValid: {
      type: Boolean,
      default: false,
    },
    hash: {
      select: false,
      type: String,
    },
    salt: {
      select: false,
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.methods.passwordIsValid = (password, confirmPassword) => {
  return confirmPassword === password;
};

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
      id: this._id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.SECRET
  );
};

const User = model('User', userSchema);

export default User;
