const Joi = require('joi');

exports.UserSchema = {
    POST: Joi.object().keys({
        username: Joi.string(),
        email: Joi.string(),
        referredBy: Joi.string()
    })
};