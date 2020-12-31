var express = require('express');
var router = express.Router();

const productController = require('../controller/productController');

/* GET home page. */
router.get('/', productController.home);

router.get('/sortBy', productController.sort);

router.get('/cart', productController.cart);

router.get('/add-to-cart/:id', productController.addToCart);

router.post('/order', productController.order);

router.get('/customer/order', productController.customerOrder);

router.get('/customer/order/:id', productController.customerSingleOrder);


router.get('/admin/order', productController.adminOrder);

router.post('/admin/order/status', productController.adminOrderStatus);

router.get('/orderDetails', productController.orderDetails);
router.post('/orderDetails', productController.orderDetailsPost);
module.exports = router;
