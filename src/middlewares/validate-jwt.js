import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';

export const validateJWT = async (req = request, res = response, next) => {

    let token = req.body.token || req.query.token || req.headers['authorization'];

    if (!token) {

        return res.status(401).json({
            msg: 'There is no token in the request'
        });
    }

    try {

        token = token.replace(/^Bearer\s+/, '');
        const decoded = jwt.verify(token, process.env.PRIVATE_SECRET_KEY);
        req.user = decoded;
        next();

    } catch (e) {

        console.log(e);
        res.status(401).json({
            msg: "This token is not valid"
        });
    }
};

export const validateRole = (...roles) => {

    return (req = request, res = response, next) => {

        if (!req.user) {

            return res.status(500).json({
                msg: 'Token must be validated first'
            });
        }

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({

                msg: `The service requires one of these roles: ${roles}`
            });
        }

        next();
    }
};

export const compareUser = async (req = request, res = response, next) => {

    const { id } = req.params;

    const { user } = req;

    try {

        const userDoc = await User.findById(user.id);

        if (!userDoc || !userDoc.status) {

            return res.status(401).json({
                msg: 'Invalid user'
            });
        }

        if (user.id !== id) {

            return res.status(403).json({
                msg: 'You do not have permission to perform this action'
            });
        }

        next();
    } catch (e) {

        console.log(e);
        res.status(500).json({
            msg: 'Server error'
        });
    }
};