const EXPREG_PHONE_NUMBER = /^\+[0-9]{10,13}$/;
const EXPREG_EMAIL = /^[^\W][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\.[a-zA-Z]{2,4}$/;
const EXPREG_SPECIAL_CARACTER = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\"|\;|\:|\s/;
const HAS_NUMBER = /\d/;

let isValidPhoneNumber = (expression) => {
  return EXPREG_PHONE_NUMBER.test(expression);
};
let isValidEmail = (expression) => {
  return EXPREG_EMAIL.test(expression);
};
let hasSpecialCaracter = (expression) => {
  return EXPREG_SPECIAL_CARACTER.test(expression);
};
let hasNumbers = (expression) => {
  return HAS_NUMBER.test(expression);
};

String.prototype.isLengthAuthorized = function (min, max) {
  let regex = new RegExp(`.{${min},${max}}`);
  return regex.test(this);
};

export { isValidPhoneNumber, hasSpecialCaracter, hasNumbers, isValidEmail };
