const {User} = require('./User');
const {Recipe} = require('./Recipe')
const {sequelize, Sequelize} = require('./db');

User.belongsToMany(Recipe, {through: 'User_Recipe'})
Recipe.belongsToMany(User, {through: 'User_Recipe'})

module.exports = {
    User,
    Recipe,
    sequelize,
    Sequelize
};
