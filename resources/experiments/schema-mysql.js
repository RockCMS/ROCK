var {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

var Db = require('./db');

/*
var Sectors = new GraphQLObjectType({
  name: 'sectors',
  description: 'list of all the sectors',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve (sectors) {
          return sectors.id;
        }
      },
      name: {
        type: GraphQLString,
        resolve (sectors) {
          return sectors.name;
        }
      }
    };
  }
});
*/


var Node = new GraphQLObjectType({
  name: 'node',
  description: 'list of all the sectors',
  fields: () => {
    return {
      nid: {
        type: GraphQLInt,
        resolve (node) {
          return node.nid;
        }
      },
      title: {
        type: GraphQLString,
        resolve (node) {
          return node.title;
        }
      },
      type: {
        type: GraphQLString,
        resolve (node) {
          return node.type;
        }
      },
      status: {
        type: GraphQLString,
        resolve (node) {
          return node.status;
        }
      },
      created: {
        type: GraphQLString,
        resolve (node) {
          return node.created;
        }
      },
      seo_headline: {
        type: GraphQLString,
        resolve (node) {
          return node.seo_headline;
        }
      },
      summary: {
        type: GraphQLString,
        resolve (node) {
          return node.summary;
        }
      },
      content: {
        type: GraphQLString,
        resolve (node) {
          return node.content;
        }
      }


    };
  }
});

/*
var Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      sectors: {
        type: new GraphQLList(Sectors),
        args: {
          id: {
            type: GraphQLInt
          },
          name: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return Db.models.sectors.findAll({ where: args });
        }
      }
    };
  }
});
*/


var Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      nodes: {
        type: new GraphQLList(Node),
        args: {
          nid: {
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          },
          type: {
            type: GraphQLString
          },
          status: {
            type: GraphQLInt
          },
          created: {
            type: GraphQLInt
          },
          seo_headline: {
            type: GraphQLString
          },
          summary: {
            type: GraphQLString
          },
          content: {
            type: GraphQLString
          }


        },
        resolve (root, args) {
          console.log(Db.models.content_node);
          return Db.models.content_node.findAll({ where: args });
        }
      }
    };
  }
});


var Schema = new GraphQLSchema({query: Query});
module.exports = Schema






/*


curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{nodes(nid:46){title}}"}' \
http://localhost:4000/api

*/





/*

https://staging.newsdigitalapi.com/
{
  article(id: "ncna844096"){
    authors {
      type
      authorType
    },
    headline {
      primary
      seo
      social
      tease
    },
    url {
      slug,
      short
    }
  }
}*/
