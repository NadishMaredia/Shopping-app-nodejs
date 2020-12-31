const Product = require('../model/productModels');
const Order = require('../model/orderModel');

exports.home = async (req, res) => {

    let products;

    if(req.query.sortBy) {
        products = await Product.find()
            .sort(req.query.sortBy);
    } else {
        products = await Product.find();
    }

    var totalQty = req.query.totalQty || 0;
    
    console.log(totalQty);

    res.render('index', { 
        title: 'Express',
        products,
        totalQty
    });
};

exports.sort = (req, res) => {
    console.log(req.body);
};

exports.addToCart = (req, res) => {
    if (!req.session.user) {
        res.redirect('/auth/register');
    } else {
        var productId = req.params.id;

        Product.findById(productId, (err, product) => {
            if (err) {
                return res.redirect('/');
            }

            if(!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                };
            }
            let cart = req.session.cart;
            if(!cart.items[productId]) {
                cart.items[productId] = {
                    item: product,
                    qty: 1,
                    price: product.price
                };
                cart.totalQty++;
                cart.totalPrice += product.price;
            } else {
                cart.items[productId].qty++;
                cart.totalQty++;
                cart.totalPrice += product.price;
            }
            res.redirect('/?totalQty=' +cart.totalQty);
        });
    }
};

exports.cart = (req, res) => {
    res.render('cart');
}

exports.order = (req, res) => {

    const { number, address} = req.body;

    if(!number || !address) {
        res.render('cart', { error: 'Please provide your details!'});
    }

    let newOrder = new Order({
        customerId: req.session.user._id,
        number: req.body.number,
        address: req.body.address,
        items: req.session.cart.items
    });

    newOrder.save()
        .then(result => {
            req.session.cart = null;
            return res.redirect('/customer/order');
        })
        .catch(err => {
            return res.redirect('/cart');
        });
};

exports.customerOrder = async (req, res) => {
    if (!req.session.user) {
        res.render('register');
    }
    var customerId = req.session.user._id;

    const orders = await Order.find({ customerId }).sort('-createdAt');
    res.render('customerOrder', { orders });
};

exports.adminOrder = async (req, res) => {

    const orders = await Order.find({ status: { $ne: 'completed'}}, null, { sort: { 'createdAt': 1}}).populate('customerId', '-password');
    res.render('adminOrder', { orders});
};

exports.adminOrderStatus = async (req, res) => {

    Order.findByIdAndUpdate({ _id: req.body.orderId }, { status: req.body.status}, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log('Updated');
        
    });

    res.redirect('/admin/order');

    // const orders = await Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }})
    //     .populate('customerId', '-password');
    // res.render('adminOrder', { orders});
};

exports.customerSingleOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (req.session.user._id.toString() === order.customerId.toString()) {
        res.render('singleOrder', {order});
    } else {
        res.redirect('/');
    }
    
};

exports.orderDetails = async (req, res) => {
    const orders = await Order.find();
    // const orders = await Order.aggregate([
    //     {$project: {customerId: 1,items:1,number:1,createdAt:1, month: {$month: '$createdAt'}}},
    //     {$match: {month: 11}}
    // ]);

    // res.json(orders);

    res.render('orderDetails', {orders});
};

exports.orderDetailsPost = async (req, res) => {

    var monthvar = Number(req.body.month);
    console.log(monthvar);
    const orders = await Order.aggregate([
        {$project: {customerId: 1,items:1,number:1,createdAt:1, month: {$month: '$createdAt'}}},
        {$match: {month: monthvar}}
    ]);
    
    console.log(orders);

    res.render('orderDetails', { orders });
};