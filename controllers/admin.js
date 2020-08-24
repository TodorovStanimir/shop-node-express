const Product = require('../models/product');
const { validationResult } = require('express-validator');

const fileHelper = require('../util/file');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true,
        editing: false,
        hasError: false,
        errorMessage: false,
        validationErrors: []
    })
}

exports.postAddProduct = (req, res, next) => {
    const { title, price, description } = req.body;
    const image = req.file;
    console.log(image);
    if (!image) {
        return res.status(422).render('admin/edit-product', {
            path: '/admin/add-product',
            pageTitle: 'Add product',
            editing: false,
            hasError: true,
            product: { title, price, description },
            errorMessage: 'Attached file is not image.',
            validationErrors: []
        });
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-product', {
            path: '/admin/add-product',
            pageTitle: 'Add product',
            editing: false,
            hasError: true,
            product: { title, price, description },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const imageUrl = image.path;

    const product = new Product({ title, price, description, imageUrl, userId: req.user });
    product.save()
        .then(result => {
            console.log('Created product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            // return res.status(500).render('admin/edit-product', {
            //     path: '/admin/add-product',
            //     pageTitle: 'Add product',
            //     editing: false,
            //     hasError: true,
            //     product: { title, imageUrl, price, description },
            //     errorMessage: 'Database operation failed, pleace try again.',
            //     validationErrors: []
            // });
            // res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const { productId } = req.params;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                editing: editMode,
                hasError: false,
                product,
                activeAddProduct: true,
                errorMessage: false,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, description } = req.body;
    const image = req.file;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            path: '/admin/edit-product',
            pageTitle: 'Edit product',
            editing: true,
            hasError: true,
            product: { title, price, description, _id: productId },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    Product.findById(productId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = title;
            product.price = price;
            product.description = description;
            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }
            return product.save().then(result => {
                console.log(result.message)
                console.log('UPDATED PRODUCT!');
                res.redirect('/admin/products');
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            console.log(products)
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.deleteProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found!'))
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: productId, userId: req.user._id })
        })
        .then(() => {
            console.log('Deleted product');
            res.status(200).json({message: 'Success!'});
            // res.redirect('/admin/products');
        })
        .catch(err => {
            res.status(500).json({message: 'Deleting product failed.'});
            // const error = new Error(err);
            // error.httpStatusCode = 500;
            // return next(error);
        });
}
