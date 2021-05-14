const { gql } = require("apollo-server-express");
module.exports = gql`
  type Customer {
    id: ID
    first_name: String
    last_name: String
    email: String
    company: String
    phone: String
    password: String
    address_book: customArray
    date: Date
    updated: Date
    wishlist: customArray
  }

  type AddressBook {
    id: ID
    _id: ID
    first_name: String
    last_name: String
    company: String
    phone: String
    address_line1: String
    address_line2: String
    city: String
    country: String
    state: String
    pincode: String
    date: Date
    updated: Date
  }

  extend type Query {
    customers: [Customer]
    customer(id: ID!): Customer
  }

  extend type Mutation {
    addCustomer(
      first_name: String
      last_name: String
      email: String
      company: String
      phone: String
      password: String
    ): [Customer]
    updateCustomer(
      id: ID!
      first_name: String
      last_name: String
      email: String
      company: String
      phone: String
      password: String
    ): [Customer]
    deleteCustomer(id: ID!): [Customer]
    addAddressBook(
      id: ID!
      first_name: String
      last_name: String
      company: String
      phone: String
      address_line1: String
      address_line2: String
      city: String
      country: String
      state: String
      pincode: String
      default_address: Boolean
    ): [Customer]
    updateAddressBook(
      id: ID!
      _id: ID!
      first_name: String
      last_name: String
      company: String
      phone: String
      address_line1: String
      address_line2: String
      city: String
      country: String
      state: String
      pincode: String
      default_address: Boolean
    ): [Customer]
    deleteAddressBook(id: ID!, _id: ID!): [Customer]
    changeWishlist(
      id: ID!
      wishlist: String
    ) : Customer
  }
`;
