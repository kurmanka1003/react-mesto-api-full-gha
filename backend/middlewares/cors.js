const corsOptions = {
  origin: 'https://mestokurmanka.students.nomoreparties.sbs',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = {
  corsOptions,
};
