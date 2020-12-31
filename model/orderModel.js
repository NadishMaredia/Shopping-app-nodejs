const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    items: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paymentType: { type: String, default: 'Cash'},
    status: { type: String, default: 'order-placed'},
});

const OrderModel = mongoose.model('Order', orderSchema);
module.exports = OrderModel;