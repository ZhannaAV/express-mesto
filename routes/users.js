const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, changeUser, changeAvatar, getMe,
} = require('../controllers/users');

router.get('/users/me', getMe);

router.get('/users', getUsers);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(20),
    about: Joi.string().required().min(2).max(30),
  }),
}), changeUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), changeAvatar);

module.exports = router;
