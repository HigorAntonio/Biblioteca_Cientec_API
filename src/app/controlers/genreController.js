const express = require('express');
const { Genre } = require('../models');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async(req, res) => {
    try {
        const { name } = req.body;
        const genre = await Genre.create({ name });

        res.send({
            genre
        });

    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.get('/', async(req, res) => {
    const genre = await Genre.findAll({ order: [['name', 'ASC']] });

    res.send(genre);
});

module.exports = app => app.use('/genres', router);