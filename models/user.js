const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// напишите код здесь
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 20,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.findUserByEmail = function (email, password) {
  return this.findOne({ email })
    .orFail(() => new Error('Неправильные почта или пароль'))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) return Promise.reject(new Error('Неправильные почта или пароль'));
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
