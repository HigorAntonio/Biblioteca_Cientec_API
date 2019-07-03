const express = require('express');
const { BookGenre, Genre } = require('../models');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async(req, res) => {
    try {
        const bookGenre = await BookGenre.create(req.body);

        res.send({
            bookGenre
        });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.post('/multi', async(req, res) => {
    try {
        const { bookId, genresId } = req.body;
        const bookGenres = [];
        for (var i = 0; i < genresId.length; i++) {
            var genreId = genresId[i];    
            bookGenres[i] = await BookGenre.create({
                bookId, 
                genreId
            });
        }

        res.send({
            bookGenres
        });
    } catch (err) {
        res.status(400).send({ error: err });
    }
});

router.get('/:bookId', async(req, res) => {
    const bookGenre = await BookGenre.findAll({
        where: { bookId: req.params.bookId }
    });

    if (!bookGenre) {
        return res.status(400).send({ error: 'Could not find a register with the informed id' });
    }

    var bookGenres = [];
    for (var i = 0; i < bookGenre.length; i++) {
        bookGenres[i] = await Genre.findOne({
            where: {
                id: bookGenre[i]["genreId"]
            }
        });
    }

    return res.send({
        //bookGenre,
        bookGenres
    });
});

module.exports = app => app.use('/bookGenre', router);