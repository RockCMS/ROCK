var express = require('express');
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var index = require('./routes/index');
//var users = require('./routes/users');

var schema = require('./schema-mysql');
var graphqlHTTP = require('express-graphql');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//

//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', users);

//app.use('/api', graphqlHTTP({schema, graphiql: true}));

// Create an express server and a GraphQL endpoint
app.use('/api', graphqlHTTP({
  schema: schema,  // Must be provided
  graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));







// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
