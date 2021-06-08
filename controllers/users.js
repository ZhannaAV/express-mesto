const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(() => new Error('NotFound'))
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Объект не найден' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Объект не найден' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === 'ValidatorError') return res.status(400).send({ message: 'Переданы некорректные данные' });
        return res.status(500).send({ message: 'Произошла ошибка' });
      }));
};

module.exports.getMe = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidatorError' || err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Объект не найден' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.changeUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidatorError' || err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Объект не найден' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.changeAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidatorError' || err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Объект не найден' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByEmail(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidatorError' || err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'Неправильные почта или пароль') return res.status(401).send({ message: err.message });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
