const express = require('express');
const { Author } = require('../models');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const author = await Author.create(req.body);

        res.send({
            author
        });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.get('/', async (req, res) => {
    const authors = await Author.findAll({ order: [['name', 'ASC']] });

    return res.send(authors);
});

router.get('/:id', async (req, res) => {
    const author = await Author.findByPk(req.params.id);

    if (!author) {
        return res.status(400).send({ error: 'Could not find a author with the informed id' });
    }

    return res.send(author);
});

module.exports = app => app.use('/authors', router);