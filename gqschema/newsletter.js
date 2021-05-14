const { gql } = require("apollo-server-express");

module.exports = gql`
  type Newsletter {
    id: ID
    email: String
    date: Date
    updated: Date
  }

  extend type Query {
    newsletters: [Newsletter]
  }

  extend type Mutation {
    addNewsletter(email: String): Newsletter
  }
`;
