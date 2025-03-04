const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../utils/errors/unauthorized-err');
const ForbiddenError = require('../utils/errors/forbidden-err');


module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email }).select('+password')
        .then((user) => {            
            if (!user) {
                const error = new Error();
                error.name = 'LoginError';
                return Promise.reject(error);
            }
            if (user.privilege < 0) {
                const error = new Error();
                error.name = 'PrivilegeError';
                return Promise.reject(error);
            }

            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        const error = new Error();
                        error.name = 'LoginError';
                        return Promise.reject(error);
                    }
                    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
                        expiresIn: "7d",
                    });
                    res.send({ token });
                    return Promise.resolve();
                });
        })
        .catch((err) => {
            if (err.name === 'LoginError') {
                next(new UnauthorizedError('Login error'));
            } else if (err.name === 'PrivilegeError') {
                next(new ForbiddenError('Banned'));
            } else {
                next(err);
            }
        })
}
