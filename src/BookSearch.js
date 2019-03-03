import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import _debounce from 'lodash/debounce';
import {faGithub} from '@fortawesome/free-brands-svg-icons';

const extractAPIErrorMessage = (error) => {
  if (error.response) {
    return error.response.data ? error.response.data.message : error.response.data;
  } else if (error.request) {
    return "Error: could not make http request";
  } else {
    return error.message;
  }
}

function Rating(props) {
  
  let percentage = 100 * (props.value / 5.0);
  
  return (
    <div className="rating">
      <div className="empty-stars" />
      <div className="full-stars" style={{ width: `${percentage}%` }} />
    </div>
  );
}

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

    axios.post(`https://api.mylibrary.cool/my-books`, 
    {title: book.best_book.title}
    )
      .then((response) => {
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
              <span className="publication-year">{this.props.book.original_publication_year}</span></h5>
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
    this.searchBooks('sapiens');
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

      if(this.searchBooksSource) {
        this.searchBooksSource.cancel();
      }
      this.searchBooksSource = axios.CancelToken.source();

      this.setState({message: 'Loading'});
      axios.get(`https://api.mylibrary.cool/books`, {
        params: {
          q: query
        },
        cancelToken: this.searchBooksSource.token
      })
        .then((response) => {
          this.searchBooksSource = null;
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
          this.searchBooksSource = null;

          if (!axios.isCancel(error)) {
            this.setState({
              message: `Error searching books: ${extractAPIErrorMessage(error)}`,
              books: []
            });
          }
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