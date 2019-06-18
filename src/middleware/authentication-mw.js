const jwt = require('jsonwebtoken');
const UserModel = require('../models/user-model');


const authenticationMw = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findOne({_id: decoded._id, 'tokens.token': token});
        if (!user) {
            throw new Error('No user was found.');
        }

        req.currentUser = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send({error: 'Please authenticate'});
    }
};

module.exports = authenticationMw;