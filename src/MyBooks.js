import React, { Component } from 'react';
import Rating from './Rating';
import axios from 'axios';
import {extractAPIErrorMessage} from './utilities';

class MyBooks extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      message: null,
      error: null,
      books: []
    };
  }
  
  componentDidMount () {
    this.loadMyBooks();
  }

  loadMyBooks() {
    this.setState({loading: true});
    axios.get(`https://api.mylibrary.cool/my-books`)
      .then((response) => {
        this.setState({
          loading: false,
          books: response.data,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: `Error getting books: ${extractAPIErrorMessage(error)}`,
          books: []
        });
      });
  }
  
  render () {
    
    let message = 
      this.state.loading ? 'Loading' :
        this.state.error ? `Error: ${this.state.error}` :
          this.state.books.length ? `${this.state.books.length} books in your library` :
            'No books saved yet';
    
    return (
      <div className="MyBooks">
        <p>{ message }</p>
        <ul className="p-0 list-group-flush">
          { this.state.books.map(book => (
            <li className="list-group-item" key={book.id}>
              <div className="d-flex flex-row">
                <div className="pr-2">
                  <img className="thumbnail" src={book.imageUrl} alt={`book thumbnail`}/>
                </div>
                <div>
                  <h5>{book.title}
                    <span className="publication-year ml-1">{book.publicationYear}</span>
                  </h5>
                  <div>
                    by {book.author ? book.author.name : ''} <Rating value={book.goodReadsRating}/>
                    <span className="rating-average">{book.goodReadsRating} Average Rating</span>
                  </div>
                </div>
              </div>
            </li>
          )) }
        </ul>
      </div>
    );
  }
}

export default MyBooks;