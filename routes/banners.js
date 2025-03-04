const auth = require('../middlewares/auth');
const router = require('express').Router();
const adminPrivilege = require('../middlewares/adminPrivilege');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categories');
const { createBanner, deleteBanner, getBanners } = require('../controllers/banners');


router.post('/', auth, adminPrivilege, createBanner);
router.delete('/:id', auth, adminPrivilege, deleteBanner);
router.get('/', getBanners);

module.exports = router;