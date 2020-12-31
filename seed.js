const Product = require('./model/productModels');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fshop', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log(err));

const products = [
    new Product({
        imagePath: 'burger1.jpg',
        name: 'Chicken Burger',
        price: 160
    }),
    new Product({
        imagePath: 'burger2.jpg',
        name: 'Chicken Jumbo Burger',
        price: 200
    }),
    new Product({
        imagePath: 'burger3.jpg',
        name: 'Chicken Cheese Burger',
        price: 180
    }),
    new Product({
        imagePath: 'broast1.jpg',
        name: 'Chicken Broast',
        price: 220
    }),
    new Product({
        imagePath: 'broast2.jpg',
        name: 'Chicken Leg Broast',
        price: 200
    }),
    new Product({
        imagePath: 'broast3.jpg',
        name: 'Chicken Full Broast',
        price: 350
    }),
    new Product({
        imagePath: 'sandwich1.jpg',
        name: 'Chicken Sandwich',
        price: 175
    }),
    new Product({
        imagePath: 'sandwich2.jpg',
        name: 'Chicken Jumbo Sandwich',
        price: 200
    })
];

var done = 0;
for (var i = 0;i < products.length;i++) {
    products[i].save(function(err, result) {
        done++;
        if(done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}