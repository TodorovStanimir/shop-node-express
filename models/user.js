const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function (product) {
    const updatedCartItems = [...this.cart.items];
    const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());

    (cartProductIndex !== -1)
        ? updatedCartItems[cartProductIndex].quantity++
        : updatedCartItems.push({ productId: product._id, quantity: 1 })

    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save()
}

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(cp => cp.productId.toString() !== productId.toString());

    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);
// const ObjectID = require('mongodb').ObjectID;
// const { getDb } = require('../util/database');

// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }


//     save() {
//         const db = getDb();

//         return db.collection('users')
//             .insertOne(this)
//             .then((user) => {

//             })
//             .catch(err => console.log(err))
//     }

//     addToCart(product) {
//         const updatedCartItems = [...this.cart.items];

//         const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());

//         (cartProductIndex !== -1)
//             ? updatedCartItems[cartProductIndex].quantity++
//             : updatedCartItems.push({ productId: new ObjectID(product._id), quantity: 1 })

//         const updatedCart = { items: updatedCartItems };
//         const db = getDb()
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectID(this._id) },
//                 { $set: { cart: updatedCart } })
//     }

//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(it => it.productId.toString() !== productId.toString());

//         const db = getDb()
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectID(this._id) },
//                 { $set: { cart: { items: updatedCartItems } } })
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => i.productId)
//         return db.collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 return products.map(prod => {
//                     return {
//                         ...prod,
//                         quantity: this.cart.items.find(it => {
//                             return it.productId.toString() === prod._id.toString();
//                         }).quantity
//                     };
//                 });
//             })
//             .catch(err => console.log(err));
//     }



//     addOrder() {
//         const db = getDb();
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectID(this._id),
//                     name: this.name
//                 }
//             };
//             return db.collection('orders').insertOne(order)
//         })
//             .then((result) => {
//                 this.cart = { items: [] }
//                 return db.collection('users')
//                     .updateOne(
//                         { _id: new ObjectID(this._id) },
//                         { $set: { cart: { items: [] } } }
//                     );

//             })
//             .catch(err => console.log(err))
//     }

//     getOrders() {
//         const db = getDb()
//         return db.collection('orders')
//             .find({ 'user._id': new ObjectID(this._id) })
//             .toArray();
//     }

//     static findById(userId) {
//         const db = getDb();

//         return db.collection('users').findOne({ _id: new ObjectID(userId) })
//     }
// };

// module.exports = User;