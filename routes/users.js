const router = require('express').Router();

const {
  getUsers, getUser, changeUser, changeAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUser);

router.patch('/users/me', changeUser);

router.patch('/users/me/avatar', changeAvatar);

module.exports = router;
