import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let userSchema = new mongoose.Schema({
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
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000)
    },
    'MY_SECRET'
  );
};

export default mongoose.model('User', userSchema);
