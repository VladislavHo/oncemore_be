const auth = require('../middlewares/auth');
const router = require('express').Router();
const { 
  createComment, 
  deleteComment, 
  getComments
} = require('../controllers/comments');
const adminPrivilege = require('../middlewares/adminPrivilege');


router.post('/', auth, createComment);
router.delete('/:id', auth, adminPrivilege, deleteComment);
router.get('/:reviewId', getComments);

module.exports = router;