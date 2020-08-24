const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);;

// const ObjectID = require('mongodb').ObjectID;
// const { getDb } = require('../util/database');

// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new ObjectID(id) : null
//         this.userId = userId
//     }

//     save() {
//         const db = getDb();
//         let dbOb;

//         if (this._id) {
//             dbOb = db.collection('products').updateOne({ _id: this._id }, { $set: this })
//         } else {
//             dbOb = db.collection('products').insertOne(this)
//         }

//         return dbOb
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => console.log(err))
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products')
//             .find()
//             .toArray()
//             .then(products => {
//                 return products;
//             })
//             .catch(err => console.log(err))
//     }

//     static findById(productId) {
//         const db = getDb();
//         return db.collection('products')
//             .find({ _id: new ObjectID(productId) })
//             .next()
//             .then(product => {
//                 console.log(product)
//                 return product;
//             })
//             .catch(err => console.log(err))
//     }

//     static deleteById(productId) {
//         const db = getDb();
//         return db.collection('products')
//             .findOneAndDelete({ _id: new ObjectID(productId) })
//             .then(result => {
//                 console.log(result)
//                 return result;
//             })
//             .catch(err => console.log(err))
//     }
// }

// module.exports = Product;