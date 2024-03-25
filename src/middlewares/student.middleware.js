import jwt from 'jsonwebtoken';

import {
    response_401,
    response_400,
    response_500,
} from '../utils/responseCodes.js';
import User from '../models/user.model.js';

const studentMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !/(Bearer )\w+/.test(authHeader)) {
            return response_400(res, 'this Request is invalid');
        }
        const authToken = authHeader.replace('Bearer ', '');

        let userMongoId;

        try {
            const { payload } = jwt.verify(authToken, process.env.SECRET); // will throw err if token is invalid or expired
            req.isAuthenticated = true;
            userMongoId = payload.id;
        } catch (err) {
            return response_401(res, 'Request is very unauthorized');
        }
        const user = await User.findById(userMongoId);
        if (!user || user.role!="Student") {
            return response_401(res, 'Request is unauthorized');
        }

        req.user = user;
        next();
    } catch (err) {
        return response_500(res, 'Internal Server Error', err);
    }
};

export default studentMiddleware;