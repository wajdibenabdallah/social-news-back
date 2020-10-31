const getErrorDbMessage = (error) => {
  switch (error.code) {
    case 11000:
      return 'email or phone in use';
    default: {
      return error.message || 'unknown DB error';
    }
  }
};

export default getErrorDbMessage;
