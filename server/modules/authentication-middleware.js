const rejectUnauthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.sendStatus(403);
  }
};

const checkRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
      next();
  } else {
      res.sendStatus(403);
  }
};

module.exports = { rejectUnauthenticated, checkRole };
