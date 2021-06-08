const router = require('express').Router();

const {
  getUsers, changeUser, changeAvatar, getMe,
} = require('../controllers/users');

router.get('/users/me', getMe);

router.get('/users', getUsers);

router.patch('/users/me', changeUser);

router.patch('/users/me/avatar', changeAvatar);

module.exports = router;
