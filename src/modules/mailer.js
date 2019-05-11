const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass } = require('../config/mail');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {  user, pass }
});

transport.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        layoutsDir: path.resolve('./src/resources/mail/'),
        defaultLayout : 'template',
        partialsDir : path.resolve('./src/resources/partials/')
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));

module.exports = transport;