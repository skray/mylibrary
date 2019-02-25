import React, { Component } from 'react';
import axios from 'axios';
import _debounce from 'lodash/debounce';

class BookSearch extends Component {
  constructor(props) {
    super(props);

    this.handleSearchChange = this.handleSearchChange.bind(this);

    this.state = {
      message: 'Search books',
      books: []
    };
  }

  searchBooks (query) {
    if(!query) {
      this.setState({message: 'Search books', books: []});
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
      <div>
        <input type="text" autoFocus onChange={this.handleSearchChange}/>

        <p>{this.state.message}</p>
    
        <ul>
          {this.state.books.map(book => <li key={book.id}>{ book.best_book.title }</li>)}
        </ul>
      </div>
    )
  }
}

export default BookSearch;