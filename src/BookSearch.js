import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { searchBooks, addToMyBooks } from './api';
import _debounce from 'lodash/debounce';
import { extractAPIErrorMessage } from './utilities';
import Rating from './Rating';

class SearchResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adding: false,
      error: null
    };
    
    this.handleAddBookClicked = this.handleAddBookClicked.bind(this);
  }
  
  handleAddBookClicked (book) {

    this.setState({ adding: true });

    addToMyBooks(book)
      .then(() => {
        this.setState({
          adding: false,
          added: true
        });
      })
      .catch(error => {
        this.setState({
          adding: false,
          added: false,
          error: `Error adding book: ${extractAPIErrorMessage(error)}`,
        });
      });
  }
  
  render() {
    
    let buttonContent = 
      this.state.added ? 'In My Books' : 
        this.state.adding ? (<span><FontAwesomeIcon icon={faCircleNotch} className="mr-1 fa-spin"/> Adding</span>)
          : 'Add to My Books';

    return (
      <li className="list-group-item">
        <div className="d-flex flex-row">
          <div className="pr-2">
            <img className="thumbnail" src={this.props.book.best_book.image_url} alt={`small thumbnail for ${this.props.book.best_book.title}`}/>
          </div>
          <div>
            <h5>{this.props.book.best_book.title}
              <span className="publication-year ml-1">{this.props.book.original_publication_year}</span></h5>
            <div>
              by {this.props.book.best_book.author.name} <Rating value={this.props.book.average_rating}/>
              <span className="rating-average">{this.props.book.average_rating} Average Rating</span>
            </div>
            <Button 
              className="add-btn"
              variant="info" 
              disabled={this.state.adding || this.state.added}
              onClick={() => this.handleAddBookClicked(this.props.book)}>
              { buttonContent }
            </Button>
          </div>
        </div>
      </li>
    );
  }
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

  componentDidMount() {
    // this.searchBooks('sapiens');
  }

  debouncedSearch = _debounce((query) => {
    this.searchBooks(query);
  },300);

  handleSearchChange (e) {
    this.debouncedSearch(e.target.value);
  }

  searchBooks (query) {
    if(!query) {
      this.setState({message: '', books: []});
    } else {

      this.setState({message: 'Loading...'});
      searchBooks(query)
        .then((searchResults) => {
          if(searchResults.canceled) {
            return;
          }
          
          if(searchResults['total-results'] > 0) {
            this.setState({
              message: `Showing Results ${searchResults['results-start']} - ${searchResults['results-end']} of ${searchResults['total-results']}`,
              books: searchResults.results.work
            });
          } else {
            this.setState({
              message: `No results`,
              books: []
            });
          }
        })
        .catch(error => {
          this.setState({
            message: `Error searching books: ${extractAPIErrorMessage(error)}`,
            books: []
          });
        });
    }

  }
  
  render()  {
    return (
      <div className="BookSearch">
        <input className="w-100 mb-3" type="text" autoFocus placeholder="Search books by title, author, or ISBN" onChange={this.handleSearchChange}/>

        <p>{this.state.message}</p>
    
        <ul className="p-0 list-group-flush">
          {this.state.books.map(book => (
            <SearchResult book={book} key={book.id}/>
          ))}
        </ul>
      </div>
    )
  }
}

export default BookSearch;