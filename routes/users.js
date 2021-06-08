const router = require('express').Router();

const {
  getUsers, getUser, changeUser, changeAvatar, getMe,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUser);

router.get('/users/me', getMe);

router.patch('/users/me', changeUser);

router.patch('/users/me/avatar', changeAvatar);

module.exports = router;
