const express = require('express');
const router = express.Router();
const TaskModel = require('../models/task-model');
const authenticationMw = require('../middleware/authentication-mw');

router.post('/', authenticationMw, async (req, res, next) => {
    const task = new TaskModel({
        ...req.body,
        owner: req.currentUser._id,
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Sorting/Pagination/Filtering
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt_asc
router.get('/', authenticationMw, async (req, res) => {
    const {completed, limit, skip, sortBy} = req.query;
    const match = {};
    const sort = {};

    if (completed) {
        match.completed = completed === 'true'
    }
    if (sortBy) {
        const parts = sortBy.split(':');
        if (!parts.length === 2) {
            throw new Error('Invalid sort by parameter.')
        }
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        await req.currentUser.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort,
            },
        }).execPopulate();
        res.send(req.currentUser.tasks);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id', authenticationMw, async (req, res) => {
    const {id} = req.params;
    try {
        const task = await TaskModel.findOne({_id: id, owner: req.currentUser._id});
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) {
        res.status(400).send(err)
    }
});

router.put('/:id', authenticationMw, async (req, res) => {
    const {id} = req.params;
    const data = req.body;
    const updates = Object.keys(data);
    const allowedFields = ['description', 'completed'];
    const isValidFields = updates.every((v) => allowedFields.includes(v));

    if (!isValidFields) {
        return res.status(400).send({error: 'Invalid user fields.'});
    }

    try {
        const task = await TaskModel.findOne({_id: id, owner: req.currentUser._id});

        if (!task) {
            return res.status(404).send();
        }
        updates.forEach(update => task[update] = data[update]);
        await task.save();
        res.send(task);
    } catch (err) {
        res.status(400).send(err)
    }
});

router.delete('/:id', authenticationMw, async (req, res) => {
    const {id} = req.params;
    try {
        const user = await TaskModel.findOneAndDelete({_id: id, owner: req.currentUser._id});
        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});


module.exports = router;