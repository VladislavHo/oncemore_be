const { 
  getReviews, 
  getReview, 
  getProductReviews, 
  getUserReviews, 
  createReview,
  deleteReview,
  addViewToVideo
} = require('../controllers/reviews');
const adminPrivilege = require('../middlewares/adminPrivilege');
const router = require('express').Router();
const auth = require('../middlewares/auth');

router.get('/', getReviews);
router.get('/:id', getReview);
router.patch('/:id', addViewToVideo);
router.delete('/:id', auth, adminPrivilege, deleteReview);
router.get('/product/:id', getProductReviews);
router.get('/user/:id', getUserReviews);
router.post('/', auth, createReview);

module.exports = router;