const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users) return res.status(200).send(users);
      return res.status(404).send({ message: 'Пользователи не найдены' });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) return res.status(200).send(user);
      return res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidatorError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.changeUser = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidatorError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.changeAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidatorError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
