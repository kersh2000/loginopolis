const {sequelize} = require('./db');
const {User} = require('./');
const users = require('./seedData');
const bcrypt = require('bcrypt')

const SALT_COUNT = 5

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db
  const promises = users.map(async (user) => {
    const hash = await bcrypt.hash(user.password, SALT_COUNT);
    user.password = hash;
    return user;
  });
  const hashedUsers = await Promise.all(promises);
  await User.bulkCreate(hashedUsers);
};

module.exports = seed;
