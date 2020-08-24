const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body('email', 'Please enter a valid email!').isEmail(),
    body('password', 'Please enter a password with only numbers and text and at least 5 charachters!').isLength({ min: 5 }).isAlphanumeric()
],
    authController.postLogin);

router.post('/signup',
    [check('email').isEmail().withMessage('Please enter a valid email!').custom((value, { req }) => {
        return User.findOne({ email: value })
            .then(user => {
                if (user) {
                    return Promise.reject('E-mail exists allready, please try another e-mail!')
                }
            });
    }),
    body('password', 'Please enter a password with only numbers and text and at least 5 charachters!')
        .isLength({ min: 5 }).isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true
    })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;