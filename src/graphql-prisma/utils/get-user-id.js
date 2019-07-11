import jwt from 'jsonwebtoken';

const getUserId = ({request: {headers: {authorization}}}, requireAuth = true) => {
    if (authorization) {
        const token = authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return decoded.userId;
    }

    if (requireAuth) {
        throw new Error('Authentication required');
    }

    return null;
};

export {getUserId as default}