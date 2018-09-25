var express = require('express');
var request = require('request');
var router = express.Router();
var app = express();
var expressGraphQL = require('express-graphql');


/*
//mySQL Connection

var Sequelize = require('sequelize');
var sequelize = new Sequelize('newscms', 'bdp_bdpage', 'eastcedar', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});


// Or you can simply use a connection uri
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

*/



var schema = require('./schema.js');


// Create an express server and a GraphQL endpoint
app.use('/graphql', expressGraphQL({
  schema: schema,  // Must be provided
  rootValue: root,
  graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));

















/*

var Node = sequelize.define('Node', {  }, {
  // don't add the timestamp attributes (updatedAt, createdAt)
  timestamps: false,

  // don't delete database entries but set the newly added attribute deletedAt
  // to the current date (when deletion was done). paranoid will only work if
  // timestamps are enabled
  paranoid: true,

  // don't use camelcase for automatically added attributes but underscore style
  // so updatedAt will be updated_at
  underscored: true,

  // disable the modification of tablenames; By default, sequelize will automatically
  // transform all passed model names (first parameter of define) into plural.
  // if you don't want that, set the following
  freezeTableName: true,

  //logging: false,

  // define the table's name
  tableName: 'node'
})



Node.findAll({
  attributes: ['nid', 'title']
}).then(console.log(Node));

*/





/*
sequelize.query('SELECT uid,name,mail,status FROM users LIMIT 2',
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }
).then(Users => {
  console.log(Users)
})
*/









/*
const User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
});

// force: true will drop the table if it already exists
User.sync({force: true}).then(() => {
  // Table created
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});
*/



