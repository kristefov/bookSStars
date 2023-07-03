const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth")

const resolvers = {
  Query: {
    loggedIn: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      } 
      const user = await User.findById(context.user._id);

      return user

    }
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
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
    saveBook: async (parent, { bookData }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },

    deleteBook: async (parent, { bookId }, context) => {
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