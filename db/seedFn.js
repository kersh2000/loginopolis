const {sequelize} = require('./db');
const {User, Recipe} = require('./');
const bcrypt = require('bcrypt')
const data = require('./seedData');

const SALT_COUNT = 5

const seed = async () => {
  const users = data["users"]

  await sequelize.sync({ force: true }); // recreate db
  const promises = users.map(async (user) => {
    const hash = await bcrypt.hash(user.password, SALT_COUNT);
    user.password = hash;
    return user;
  });
  const hashedUsers = await Promise.all(promises);
  const createdUsers = await User.bulkCreate(hashedUsers);
  await addConnections(createdUsers)
};

async function addConnections(users) {
  const recipes = data["recipes"]
  const cons = data["connections"]

  recipes.forEach(recipe => {
    recipe.ingredients = JSON.stringify(recipe.ingredients);
    recipe.steps = JSON.stringify(recipe.steps);
  });

  const createdRecipes = await Recipe.bulkCreate(recipes)

  cons.forEach(async(con) => {
    const usersRecipes = con["recipe_indices"].map(index => { return createdRecipes[index] })
    await users[con["user_index"]].addRecipes(usersRecipes)
  })
}

module.exports = seed;
