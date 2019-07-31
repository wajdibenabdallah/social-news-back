// me
const me = (req, res, next) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
};

export { me };
