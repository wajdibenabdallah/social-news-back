// me
const me = (req, res, next) => {
  res.send(req.isAuthenticated());
};

export { me };
