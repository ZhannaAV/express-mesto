const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '60b65c3396748cddc877f68f',
  };
  next();
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', createUser);
app.post('/signin', login);

app.use('/', cardsRouter);
app.use('/', usersRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
