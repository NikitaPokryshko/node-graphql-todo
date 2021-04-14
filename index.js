require('dotenv').config();

const express = require('express');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const sequelize = require('./utils/database');
const schema = require('./graphql/schema');
const resolver = require('./graphql/resolver');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');

app.use(express.static(PUBLIC));

// Middleware to parse request body (json requests)
app.use(express.json())

app.use(graphqlHTTP({
  schema: schema,
  rootValue: resolver,
  graphiql: true,
}));


// Express will search for index.html inside static PUBLIC folder
app.use((req, res, next) => {
  res.sendFile('/index.html')
});

async function start() {
  try {
    await sequelize.sync(); // {force: true} will override model fields
    app.listen(PORT);
  } catch (err) {
    console.log(err)
  }
}

start();
