const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const { User } = require('./db');

const SALT_COUNT = 5

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register', async (req, res, next) => {
  const {username, password} = req.body
  User.findOne({where: { username: username }})
    .then(user => {
      if (user) {
        res.status(400).send(`User with username: ${username}, already exists!`)
      } else {
        bcrypt.hash(password, SALT_COUNT, (error, hashedPassword) => {
          User.create({
            username: username,
            password: hashedPassword
          })
            .then(res.status(200).send(`successfully created user ${username}`))
            .catch(error => {
              console.error(error)
              next(error)
            })
        })
      }
    }).catch(error => {
      console.error(error)
      next(error)
    })
})

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB


// we export the app, not listening in here, so that we can run tests
module.exports = app;
