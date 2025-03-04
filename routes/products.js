const { deleteProduct, createProduct, getProducts, getProduct, editProduct, likeProduct, unlikeProduct, addPhotoToProduct } = require('../controllers/products');
const auth = require('../middlewares/auth');
const router = require('express').Router();
const adminPrivilege = require('../middlewares/adminPrivilege');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.patch('/:id', auth, adminPrivilege, editProduct);
router.post('/:id', auth, adminPrivilege, addPhotoToProduct);
router.post('/', createProduct);
router.delete('/:id', auth, adminPrivilege, deleteProduct);

router.patch('/:id/like', auth, likeProduct);
router.patch('/:id/unlike', auth, unlikeProduct);

module.exports = router;