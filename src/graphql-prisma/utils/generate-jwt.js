import jwt from "jsonwebtoken";

export const generateJwt = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7 days'})
};
