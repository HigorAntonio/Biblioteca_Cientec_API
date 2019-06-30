const express = require('express');
const { Review } = require('../models');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const userId =  req.userId;
        const { bookId, review, rating} = req.body;
        const rev = await Review.create({
            userId, bookId, review, rating
        });

        res.send({
            rev
        });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.get('/', async (req, res) => {
    const reviews = await Review.findAll({ order: [['updatedAt', 'DESC']] });

    return res.send(reviews);
});

router.get('/:bookId', async (req, res) => {
    const review = await Review.findAll({ 
        where: {
            userId: req.userId, 
            bookId: req.params.bookId
        }
    });

    if (!review) {
        return res.status(400).send({ error: 'Could not find a review with the informed id' });
    }

    return res.send(review);
});

module.exports = app => app.use('/reviews', router);