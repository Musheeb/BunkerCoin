const ensureSuperAdmin = (req, res, next) => {
    if (req.user.isSuper) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  };
  
  module.exports = ensureSuperAdmin;
  