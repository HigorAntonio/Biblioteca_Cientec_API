const express = require('express');
const { Lending, Book } = require('../models');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const userId =  req.userId;
        const { bookId, returnDate} = req.body;

        const lending = await Lending.create({
            userId, bookId, returnDate
        });

        const book = await Book.update(
            { status: 'emprestado' },
            { where: { id: bookId } }
        );

        if (!book) {
            return res.status(400).send({ error: 'Could not find a book with the informed id' });
        }

        res.send({
            lending
        });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.get('/', async (req, res) => {
    const lending = await Lending.findAll({ order: [['updatedAt', 'DESC']] });

    return res.send(lending);
});

router.get('/user', async (req, res) => {
    const lending = await Lending.findAll({ 
        where: {
            userId: req.userId, 
        }
    });

    if (!lending) {
        return res.status(400).send({ error: 'Could not find a lending with the informed id' });
    }

    return res.send(lending);
});

module.exports = app => app.use('/lendings', router);