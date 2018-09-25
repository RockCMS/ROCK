const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');



const customers = [
  {id: 1, name: 'John Doe', email: 'jdoe@msn.com', age: 35},
  {id: 2, name: 'Richard', email: 'rhelllo@msn.com', age: 25},
  {id: 3, name: 'Christina', email: 'ctina@msn.com', age: 45},
  {id: 4, name: 'Rebecca', email: 'rbca@yahoo.com', age: 33},
];


//Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields:() => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    age: {type: GraphQLInt},
  })
})

//Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
        args: {
          id: {type: GraphQLString}
        },
        resolve(parentValue, args){
          for(let i=0; i<customers.length; i++){
            if (customers[i].id == args.id) {
              return customers[i];
            }
          }
        }
    }
  }

});

module.exports = new GraphQLSchema({
  query: RootQuery
});
