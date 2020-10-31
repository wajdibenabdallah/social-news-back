import mongoose from 'mongoose';
import expReg from '../shared/regex';

const Publication = mongoose.model(
  'Publication',
  new mongoose.Schema({
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      validate: {
        validator: (value) => expReg.LENGHT(1, 30).test(value),
        message: (props) => `${props.value} is not a valid title!`,
      },
    },
    text: {
      type: String,
      required: true,
      validate: {
        validator: (value) => expReg.LENGHT(50).test(value),
        message: (props) => `${props.value} is not a valid text!`,
      },
    },
    creationDate: {
      type: Date,
      value: new Date(),
    },
    imageUri: {
      type: String,
    },
  })
);

export default Publication;
