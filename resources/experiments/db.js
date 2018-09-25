var Sequelize = require('sequelize');
var mysql = require('mysql');
var _ = require('lodash');


var config = require('./config');
//console.log(config.db_settings.database);

//mySQL Connection
var Conn = new Sequelize(config.db_settings.database, config.db_settings.user, config.db_settings.password, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});


Conn
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });



/*
var Sectors = Conn.define('sectors', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
*/







/*
var Nodes = Conn.define('node', {
    title: {
        type: Sequelize.STRING,
        allowNull: true
    }
});
*/



/*
var models = Conn.define('node', {
  nid: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING
  }
});
*/


//
var model = Conn.define('content_node', {
    nid: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    created: {
      type: Sequelize.STRING
    },
    seo_headline: {
      type: Sequelize.STRING
    },
    summary: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.STRING
    }
  }, {
  freezeTableName: true,
  timestamps: false,
  tableName: 'content_node'
})




/*
{
  nodes (nid: 46) {
    nid,
    title,
    type,
    status,
    created,
    summary,
    seo_headline,
    content
  }
}
 */




/*
var model = Conn.query('SELECT nid,title FROM node LIMIT 100',
  { replacements: ['active'], type: Conn.QueryTypes.SELECT }
).then(node => {
  console.log(node)
})
*/



/*
Conn.query('SELECT nid,title FROM node LIMIT 2',
  { replacements: ['active'], type: Conn.QueryTypes.SELECT }
).then(node => {
  console.log(node)
})
*/


/*
Sectors.sync({force: true}).then(function () {
  // Table created
  return Sectors.create({
    name: 'test'
  });
});
*/

//exports.default = Conn;
module.exports = Conn






/*

const endpoint = 'https://staging.newsdigitalapi.com';
$(function() {
    $('#getUrlSubmit').click(function() {
      const artId = $('.idField').val();
      const body = JSON.stringify({
        query: 'query getArticle($id:ID!){article(id:$id){url{primary short slug}}}',
        operationName: 'getArticle',
        variables: {id: artId},
      });
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body,
       })
      .then(resp => resp.json())
      .then(resp => $('#articleUrl').val(resp.data.article.url.primary));
  });
});

 */
