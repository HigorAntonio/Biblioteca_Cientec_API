const express = require('express');
const multer = require('multer');
const multerConfig  = require('../../config/multer');
const { Book } = require('../models');
const sequelize = require('sequelize');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', multer(multerConfig).single('cover'), async (req, res) => {
    try {
        //console.log(req.file);

        const { location: coverUrl = '', key: coverName } = req.file;
        const { isbn, title, originalTitle, edition, publisher, authorId, 
            description, numberOfPages, status = 'disponivel', language } = req.body;
        
        const book = await Book.create({
            isbn,
            title,
            originalTitle,
            edition,
            publisher,
            authorId,
            coverUrl,
            coverName,
            description,
            numberOfPages,
            language,
            status
        });

        res.send({
            book
        });
    } catch (err) {
        res.status(400).send({ error: 'Book registration failed' });
    }
});

router.get('/', async (req, res) => {
    const books = await Book.sequelize.query(`SELECT Books.id as bookId, isbn, title, originalTitle, 
        edition, publisher, coverUrl, coverName, description, numberOfPages, language, status, 
        authorId, name as authorName, about as authorAbout 
        FROM Books, Authors 
        WHERE Authors.id=authorId;`, {type: sequelize.QueryTypes.SELECT});

    if(!books) {
        return res.status(400).send({ error: 'Select all books query failed' });
    }

    return res.send(books);
});

router.get('/recentes', async (req, res) => {
    const books = await Book.sequelize.query(`SELECT Books.id as bookId, isbn, title, originalTitle, 
        edition, publisher, coverUrl, coverName, description, numberOfPages, language, status, 
        authorId, name as authorName, about as authorAbout 
        FROM Books, Authors 
        WHERE Authors.id=authorId
        ORDER BY Books.createdAt DESC;`, {type: sequelize.QueryTypes.SELECT});

    if(!books) {
        return res.status(400).send({ error: 'Select all books query failed' });
    }

    return res.send(books);
});

router.get('/populares', async (req, res) => {
    const books = await Book.sequelize.query(`SELECT COUNT(bookId) as numLendings, Books.id as bookId, 
    isbn, title, originalTitle, edition, publisher, coverUrl, coverName, description, numberOfPages, 
    language, status, authorId, name as authorName, about as authorAbout 
    FROM Books, Authors, Lendings 
    WHERE Books.id=bookId AND Authors.id=authorId 
    GROUP BY bookId ORDER BY numLendings DESC;`, {type: sequelize.QueryTypes.SELECT});

    if(!books) {
        return res.status(400).send({ error: 'Select popular books query failed' });
    }

    return res.send(books);
});

router.get('/melhornota', async (req, res) => {
    const books = await Book.sequelize.query(`SELECT AVG(rating) as bookRating, Books.id as bookId, 
    isbn, title, originalTitle, edition, publisher, coverUrl, coverName, description, numberOfPages, 
    language, status, authorId, name as authorName, about as authorAbout 
    FROM Books, Authors, Reviews 
    WHERE Books.id=bookId AND Authors.id=authorId 
    GROUP BY bookId ORDER BY bookRating DESC;`, {type: sequelize.QueryTypes.SELECT});

    if(!books) {
        return res.status(400).send({ error: 'Select best rated books query failed' });
    }

    return res.send(books);    
});

router.delete('/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
        return res.status(400).send({ error: 'Could not find a book with the informed id' });
    }

    await book.destroy();

    return res.send();
});

module.exports = app => app.use('/books', router);