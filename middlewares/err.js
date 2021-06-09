class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidatorError') return res.status(400).send({ message: 'Переданы некорректные данные' });
  if (err.message === 'Нет прав для удаления карточки') return res.status(403).send({ message: err.message });
  if (err.name === 'MongoError' && err.code === 11000) return res.status(409).send({ message: 'Не удаётся зарегистрировать пользователя' });
  if (err.statusCode) return res.status(err.statusCode).send({ message: err.message });
  return res.status(500).send({ message: 'Произошла ошибка на сервере' });
};

module.exports = { NotFoundError, errorHandler };
