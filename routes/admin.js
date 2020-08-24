const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const Product = require('../models/product');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, [
    body('title', 'Please enter a title with only numbers and text and at least 3 charachters!')
        .isLength({ min: 3 })
        .isString()
        .trim(),
    body('price', 'Please enter a number in floating format!')
        .isFloat(),
    body('description', 'Please enter a description at least 5 charachters!')
        .isLength({ min: 5 })
        .trim()
], adminController.postAddProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// /admin/edit-product => Post
router.post('/edit-product', isAuth, [
    body('title', 'Please enter a title with only numbers and text and at least 3 charachters!')
        .isLength({ min: 3 })
        .isString()
        .trim(),
    body('price', 'Please enter a number in floating format!')
        .isFloat(),
    body('description', 'Please enter a description at least 5 charachters!')
        .isLength({ min: 5 })
        .trim()
], adminController.postEditProduct);

// // /admin/delete-product => Post
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;