const router = require('express').Router();
const { 
  getCurrentUser, 
  getUser, 
  editCurrentUser, 
  blockUser,
  changeUserPoints
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const adminPrivilege = require('../middlewares/adminPrivilege');

router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, editCurrentUser);
router.get('/:id', getUser);
router.patch('/points/:id', changeUserPoints);
router.patch('/block/:id', auth, adminPrivilege, blockUser);

module.exports = router;