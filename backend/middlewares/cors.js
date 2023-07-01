const cors = require('cors');

const corsOptions = {
  origin: 'https://mestokurmanka.students.nomoreparties.sbs',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
