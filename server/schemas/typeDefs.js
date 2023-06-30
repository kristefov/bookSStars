const {gql} = require('apollo-server-express')

const typeDefs = gql`

type Auth {
    token: ID!
    user: User
}

type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book!]!
}

type Book {
    _id: ID!
    bookId: ID!
    description: String!
    authors: [String!]!
    image: String!
    link: String!
    title: String!

}
input BookInput {
    bookId: ID!
    description: String!
    authors: [String!]!
    image: String!
    link: String!
    title: String!
}

type Query {
    loggedIn: User!
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User!
    deleteBook(bookId: String!): User!

}

`
module.exports = typeDefs;