import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import  { GET_ME } from '../utils/queries'
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';



const SavedBooks = () => {
  const {loading, data} = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK)
  const userData= data?.me || {}
  const [books, setBooks] = useState();

  useEffect(()=>{
    setBooks(data?.me.savedBooks);
  },[data]);

if (!userData?.username) {
  return (
    <h4>
      You need to be logged. 
    </h4>
  );
}  



  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId: bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
      // document.getElementById(bookId).remove();
      // let counterEl = document.getElementById('counter');
      // let currentNum = parseInt(counterEl.innerText.split(' ')[1]);
      // if (currentNum === 1) {
      //   return (counterEl.innerText = 'You have no saved books!');
      // } else {
      //   counterEl.innerText = `Viewing ${currentNum - 1} saved ${
      //     currentNum === 1 ? 'book' : 'books'
      //   }`;
      // }
      const updated = books.filter((book)=> book.bookId !== bookId);   
      setBooks(updated)
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div  className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 id='counter' className='pt-5'>
          {books?.length
            ? `Viewing ${books?.length} saved ${books?.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {books?.map((book) => {
            return (
              <Col id={book.bookId} key={book.bookId}md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
