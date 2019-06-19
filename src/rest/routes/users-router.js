const UserModel = require('../models/user-model');

const express = require('express');
const router = express.Router();
const authenticationMw = require('../middleware/authentication-mw');

router.param('id', function (req, res, next, id) {
    console.log('CALLED ONLY ONCE');
    next()
});

// /* GET users listing. */
router.get('/me', authenticationMw, async (req, res, next) => {
    res.send(req.currentUser);
});

router.post('/', async (req, res, next) => {
    const user = new UserModel(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (err) {
        res.status(400).send(err);
    }
});

// todo convert keys part to a mw? or at least learn how
router.put('/me', authenticationMw, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((item) => allowedUpdates.includes(item));

    if (!isValidOperation) {
        res.status(400).send({error: 'Invalid updates!'});
    }

    try {
        updates.forEach((update) => {
            req.currentUser[update] = req.body[update];
        });

        await req.currentUser.save();

        res.send(req.currentUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/me', authenticationMw, async (req, res) => {
    try {
        await req.currentUser.remove();
        res.send(req.currentUser);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.post('/login', async (req, res, next) => {
    const {email, password} = req.body;

    try {
        const user = await UserModel.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (err) {
        res.status(400).send();
    }
});

router.post('/logout', authenticationMw, async (req, res, next) => {
    try {
        req.currentUser.tokens = req.currentUser.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.currentUser.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

router.post('/logoutAll', authenticationMw, async (req, res, next) => {
    try {
        req.currentUser.tokens = [];
        await req.currentUser.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

/** OLD/REMOVED REQUESTS
 // todo convert keys part to a mw? or at least learn how
 router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((item) => allowedUpdates.includes(item));

    if (!isValidOperation) {
        res.status(400).send({error: 'Invalid updates!'});
    }

    try {
        // Bypasses middleware
        // const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();

        res.send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

 // GET users listing.
 router.get('/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user)
    } catch (err) {
        res.status(500).send(err);
    }
});
 /**/

module.exports = router;
