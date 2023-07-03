import { gql } from '@apollo/client';

export const LOGGED_IN = gql`
    {
        loggedIn {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;