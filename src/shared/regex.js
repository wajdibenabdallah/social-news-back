const expReg = {
  IS_EMAIL: /^[^\W][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\.[a-zA-Z]{2,4}$/,
  IS_PHONE_NUMBER: /^\+[0-9]{10,13}$/,
  HAS_SPECIAL_CARACTER: /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\"|\;|\:|\s/,
  HAS_NUMBER: /\d/,
  IS_VALID_IMAGE: /^(.*\.(?!(jpg|png|jpeg)$))?[^.]*$/i,
};

export default expReg;
// Synchronized with FrontEnd

// Rules
/*
  // USER
  Firstname and Lastname should contains between 5 and 20 characters and no numeric special characters or numeric
  Email Number Should be matched with the required form
  Phone Number Should be matched with the required form
  Password should contains at least 8 characters
  // POST
  Title shouldn't be empty
  Text Should contains at least 50 characters
*/
