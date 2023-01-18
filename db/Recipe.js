const {Sequelize, sequelize} = require('./db');

const Recipe = sequelize.define('recipe', {
  title: Sequelize.STRING,
  ingredients: Sequelize.STRING,
  steps: Sequelize.STRING
});

module.exports = { Recipe };
