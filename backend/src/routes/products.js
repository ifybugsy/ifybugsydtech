const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, authorize('admin'), productController.createProduct);
router.put('/:id', protect, authorize('admin'), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);
router.put('/:id/stock', protect, authorize('admin'), productController.updateStock);

module.exports = router;
