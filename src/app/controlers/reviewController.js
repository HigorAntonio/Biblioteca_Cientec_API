const express = require('express');
const { Review } = require('../models');
const sequelize = require('sequelize');
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

        return res.send(rev);
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.put('/', async (req, res) => {
    try {
        const review = await Review.update({
            rating: req.body.rating,
            review: req.body.review
        },
        {
            where: { 
                userId: req.userId,
                bookId: req.body.bookId, 
            }
        });

        if (!review) {
            return res.status(400).send({ error: 'Could not update the review' });
        }

        return res.send();
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.get('/', async (req, res) => {
    const reviews = await Review.findAll({ order: [['updatedAt', 'DESC']] });

    return res.send(reviews);
});

router.get('/:bookId', async (req, res) => {
    const userReview = await Review.findAll({
        where: {
            userId: req.userId,
            bookId: req.params.bookId
        }
    });

    if (!userReview) {
        return res.status(400).send({ error: 'Could not find a review with the informed id' });
    }
    
    const stats = await Review.findAll({
        attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'bookRating'], 
        [sequelize.fn('COUNT', sequelize.col('userId')), 'numReviews']],
        where: {
            bookId: req.params.bookId
        }
    });
    
    if (!stats) {
        return res.status(400).send({ error: 'Could not find a review with the informed id' });
    }
    
    const reviews = await Review.sequelize.query(`SELECT userId, name as userName, bookId, 
        review, rating, Reviews.createdAt, Reviews.updatedAt 
        FROM Reviews, Users WHERE Users.id=userId and bookId=${req.params.bookId}
        ORDER BY updatedAt DESC;`,
        {type: sequelize.QueryTypes.SELECT});

    if (!reviews) {
        return res.status(400).send({ error: 'Could not find a review with the informed id' });
    }

    return res.send({
        userReview,
        stats,
        reviews
    });
});

router.delete('/:bookId', async (req, res) => {
    const review = await Review.findOne({
        where: {
            userId: req.userId,
            bookId: req.params.bookId
        }
    });

    if (!review) {
        return res.status(400).send({ error: 'Could not find a review for the informed bookId' });
    }

    await Review.destroy({
        where: {
            userId: req.userId,
            bookId: req.params.bookId  
        }
    });

    return res.send();
});

module.exports = app => app.use('/reviews', router);