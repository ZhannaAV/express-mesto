const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    // .populate(['owner', 'likes']) что-то не так с подключением этого метода
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
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
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) return res.status(200).send({ message: 'Пост удален' });
      return res.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: userId } }, { new: true })
    // .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: userId } })
    // .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
