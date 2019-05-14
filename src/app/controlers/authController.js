const express = require('express');
const { User } = require('../models');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 300,
    }); //expiresIn: '60d'
}

router.post('/register', async (req, res) => {
    if (req.body.email === "" || req.body.password === "" || req.body.name === "") {
        return res.status(400).send({ error: 'One or more empty registration fields' });
    }
    const { email } = req.body;
    try {
        if (await User.findOne({ where: { email: email } }))
            return res.status(400).send({ error: 'User already exists' });
        
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({ id: user.id }),
        });
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
    
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    try {
        //console.log(req.body);
        const user = await User.findOne({ where: {email: email}});
        if (!user)
            return res.status(400).send({ error: 'User not found' });
        
        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Invalid password' });
        
        user.password = undefined;

        res.send({ 
            user,
            token: generateToken({ id: user.id }),
        });
    } catch (err) {
        return res.status(400).send({ error: 'Authentication failed' });
    }
})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: {email: email}});

        if (!user)
            return res.status(400).send({ error: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');

        const now =  new Date();
        now.setHours(now.getHours() + 1);

        await User.findByPk(user.id)
            .then(user => {
                user.update({
                    passwordResetToken: token,
                    passwordResetExpires: now
                })
            });

        mailer.sendMail({
            to: email,
            from: 'bbtcientec@gmail.com',
            subject: 'Password Recover',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            console.log(err);
            if (err)
                return res.status(400).send({ error: 'Cannot send forgot password email' });
            
            return res.send();
        })
    } catch (err) {
        res.status(400).send({ error: 'Error on forgot password, try again '});
    }
});

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;
    
    try {
        const user = await User.findOne({ where: {email: email}});

        if (!user)
            return res.status(400).send({ error: 'User not found' });
        
        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' });
        
        const now = new Date();

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate a new one' });

        user.password = password;
        await user.save();

        res.send();

    } catch (err) {
        res.status(400).send({ error: 'Cannot reset password, try again' });
    }
})

module.exports = app => app.use('/auth', router);