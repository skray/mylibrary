import React, { Component } from 'react';
import axios from 'axios';
import _debounce from 'lodash/debounce';

function Rating(props) {
  
  let percentage = 100 * (props.value / 5.0);
  
  return (
    <div className="rating">
      <div className="empty-stars" />
      <div className="full-stars" style={{ width: `${percentage}%` }} />
    </div>
  );
}

class BookSearch extends Component {
  constructor(props) {
    super(props);

    this.handleSearchChange = this.handleSearchChange.bind(this);

    this.state = {
      message: '',
      books: []
    };
    
  }

  searchBooks (query) {
    if(!query) {
      this.setState({message: '', books: []});
    } else {

      if(this.source) {
        this.source.cancel();
      }
      this.source = axios.CancelToken.source();

      this.setState({message: 'Loading'});
      axios.get(`https://api.mylibrary.cool/books`, {
        params: {
          q: query
        },
        cancelToken: this.source.token
      })
        .then((response) => {
          this.source = null;
          let body = response.data;

          if(body['total-results'] > 0) {
            this.setState({
              message: `Showing Results ${body['results-start']} - ${body['results-end']} of ${body['total-results']}`,
              books: body.results.work
            });
          } else {
            this.setState({
              message: `No results`,
              books: []
            });
          }
        })
        .catch(error => {
          this.source = null;

          if (!axios.isCancel(error)) {
            this.setState({
              message: `Error searching books: ${error.message ? error.message : error}`,
              books: []
            });
          }
        });
    }

  }

  debouncedSearch = _debounce((query) => {
    this.searchBooks(query);
  },300);

  handleSearchChange (e) {
    this.debouncedSearch(e.target.value);
  }
  
  render()  {
    return (
      <div className="BookSearch">
        <input className="w-100 mb-3" type="text" autoFocus placeholder="Search books by title, author, or ISBN" onChange={this.handleSearchChange}/>

        <p>{this.state.message}</p>
    
        <ul className="p-0 list-group-flush">
          {this.state.books.map(book => (
            <li className="list-group-item" key={book.id}>
              <div className="d-flex flex-row">
                <div className="pr-2">
                  <img src={book.best_book.small_image_url} alt={`small thumbnail for ${book.best_book.title}`}/>
                </div>
                <div>
                  <h5>{ book.best_book.title } <span className="publication-year">{book.original_publication_year}</span></h5>
                  <div>
                    by {book.best_book.author.name} <Rating value={book.average_rating}/> <span className="rating-average">{book.average_rating} Average Rating</span> 
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default BookSearch;