const { DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const sequelize = require('../utils/database');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'publisher'),
    defaultValue: 'user'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resetPasswordToken: DataTypes.STRING,
  resetPasswordExpire: DataTypes.DATE,
}, {
  defaultScope: {
    attributes: {
      exclude: ['password']
    }
  }
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Sign JWT and return
User.prototype.getSignedJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

//Match user entered password to hashed password in db
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
User.prototype.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set exipre
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

  return resetToken;
};


// For db seeder
User.beforeBulkCreate(async (users) => {
  for (let user of users) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

module.exports = User;