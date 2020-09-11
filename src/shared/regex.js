const EXPREG_PHONE_NUMBER = /^\+[0-9]*$/g;
const EXPREG_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
const EXPREG_SPECIAL_CARACTER = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\"|\;|\:|\s/g;
const HAS_NUMBER = /\d/g;

let isValidPhoneNumber = expression => {
  return EXPREG_PHONE_NUMBER.test(expression);
};
let isValidEmail = expression => {
  return EXPREG_EMAIL.test(expression);
};
let hasSpecialCaracter = expression => {
    // console.log('----------test \n', expression, '\n');
    // console.log(EXPREG_SPECIAL_CARACTER.test(expression))
  return EXPREG_SPECIAL_CARACTER.test(expression);
};
let hasNumbers = expression => {
  return HAS_NUMBER.test(expression);
};

String.prototype.isLengthAuthorized = function (min, max) {
  let regex = new RegExp(`.{${min},${max}}`);
  return regex.test(this);
};

export { isValidPhoneNumber, hasSpecialCaracter, hasNumbers, isValidEmail };
