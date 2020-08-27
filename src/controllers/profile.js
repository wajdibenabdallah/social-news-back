// me
const me = (req, res, next) => {
  res.json(req.user[0]);
};

export { me };
