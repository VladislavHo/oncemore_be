const router = require('express').Router();
const userRouter = require('./users');
const reviewRouter = require('./reviews');
const commentRouter = require('./comments');
const productRouter = require('./products');
const cateoryRouter = require('./categories');
const bannerRouter = require('./banners');
const orderRouter = require('./orders');

const { login } = require('../controllers/login');
const { createUser } = require('../controllers/users');
const NotFoundError = require('../utils/errors/not-found-err');
const { validateUserLogin, validateUserData } = require('../middlewares/validator');
const auth = require('../middlewares/auth');
const multer = require('multer');
const { OK_CODE } = require('../utils/errors');


router.post('/signin', validateUserLogin, login);
router.post('/signup', validateUserData, createUser);

router.use('/users/', userRouter);
router.use('/reviews/', reviewRouter);
router.use('/comments/', commentRouter);
router.use('/products/', productRouter);
router.use('/categories/', cateoryRouter);
router.use('/banners/', bannerRouter);
router.use('/orders/', orderRouter);




const upload = multer({ dest: "uploads/"});
router.post('/upload', upload.single("file"), auth, (req, res) => {
    if (req.file)
        res.status(OK_CODE)
            .send({ data: req.file })
});
router.get('/uploads/:id', (req, res) => {
    const { id } = req.params;
    res.sendFile(`./uploads/${id}`, { root: '.' });
});

router.use('*', (req, res, next) => {
    next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
