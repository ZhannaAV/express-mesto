const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(() => new Error('NotFound'))
  // .populate(['owner', 'likes']) что-то не так с подключением этого метода
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Объект не найден' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;
  Card.create({ name, link, owner: userId })
  // .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidatorError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => {
      if (card.owner === userId) return card._id;
      return Promise.reject(new Error('Нет прав для удаления поста'));
    })
    .then((id) => Card.findByIdAndRemove(id)
      .then(() => res.status(200).send({ message: 'Пост удален' })))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'Нет прав для удаления поста') return res.status(403).send({ message: err.message });
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Объект не найден' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => new Error('NotFound'))
  // .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Объект не найден' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: userId } })
    .orFail(() => new Error('NotFound'))
  // .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Объект не найден' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
