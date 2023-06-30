import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation ($user: UserInput!) {
    createUser(user: $user) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;