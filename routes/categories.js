const auth = require('../middlewares/auth');
const router = require('express').Router();
const adminPrivilege = require('../middlewares/adminPrivilege');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categories');


router.post('/', auth, adminPrivilege, createCategory);
router.delete('/', auth, adminPrivilege, deleteCategory);
router.get('/', getCategories);

module.exports = router;