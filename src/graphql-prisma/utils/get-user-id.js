import jwt from 'jsonwebtoken';

const getUserId = ({request: {headers: {authorization}}}) => {
    if (!authorization) {
        throw new Error('Authentication required');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded.userId;
};

export {getUserId as default}