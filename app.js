require('dotenv').config();
const path = require('path');
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require("./middlewares/errorHandler");
const limiter = require('./middlewares/limiter');
const { DB_HOST } = require('./utils/config');
const multer = require('multer');


const app = express();
const { PORT = 3030 } = process.env;

app.use(cors());

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(DB_HOST);

app.get('/crash-test', () => {
    setTimeout(() => {
        throw new Error('Server will crash now');
    }, 0);
});

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);

module.exports = app;