const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaClient'); // Update path accordingly

const authenticateJWT = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assumes "Bearer <token>"

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await prisma.admin.findUnique({
        where: { uuid: decoded.uuid },
        select: { token: true } // Only select the token field
      });

      if (admin && admin.token === token) {
        req.user = decoded;
        next();
      } else {
        res.status(401).send({
          response: "Failed",
          message: req.t('unauthorised')

        });
        //res.sendStatus(401); // Forbidden if token does not match
      }
    } catch (err) {
      res.status(401).send({
        response: "Failed",
        message: req.t('unauthorised')

      });// Forbidden if token verification fails
    }
  } else {
    res.status(401).send({
      response: "Failed",
      message: req.t('unauthorised')

    }); // Unauthorized if no token is provided
  }
};

module.exports = authenticateJWT;

//For user registration only to authenticate the temporary JWT on OTP verification.
const registrationAuth = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assumes "Bearer <token>"
};
exports.registrationAuth = registrationAuth;