require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const errors = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { corsMiddleware } = require('./middlewares/cors');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(requestLogger);

app.use(corsMiddleware);

app.use(express.json());

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors);

app.listen(PORT, () => {
});
