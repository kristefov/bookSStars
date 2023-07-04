/* These lines of code are importing necessary dependencies and modules for the resolver function. */
const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth")

/* This code defines a resolver function for the `me` query. The `me` query is used to retrieve the
currently logged-in user. */
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      } 
      const user = await User.findById(context.user._id);

      return user

    }
  },

 /* The `addUser` mutation resolver is responsible for creating a new user in the database. It takes in
 the `username`, `email`, and `password` as arguments. */
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    /* The `login` resolver is responsible for handling the login functionality. It takes in the
    `email` and `password` as arguments. */
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    /* The `saveBook` resolver is a mutation resolver that is responsible for saving a book to a user's
    list of saved books. It takes in three parameters: `parent`, `bookData`, and `context`. */
    saveBook: async (parent, { bookData }, context) => {
      console.log(bookData)
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: bookData } },
        { new: true }
      );
      return updatedUser;
    },

    /* The `removeBook` resolver is a mutation resolver that is responsible for removing a book from a
    user's list of saved books. It takes in three parameters: `parent`, `bookId`, and `context`. */
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );

      return updatedUser
    },

  
  },
};

module.exports = resolvers