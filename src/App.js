import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import _debounce from 'lodash/debounce';
import booksLogo from "./media/books.png";

import './App.scss';

class App extends Component {

  source
  
  constructor(props) {
    super(props);
    
    this.handleSearchChange = this.handleSearchChange.bind(this);
    
    this.state = {
      message: 'Search books',
      books: []
    }
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
  
  render() {
    return (
      <div id="wrapper">

        <nav className="header navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/">
            <img src={booksLogo} className="d-inline-block align-middle mr-2" width="30" height="30" alt="" />
              My Library
            </a>
          <div className="navbar-nav mr-auto">
            
          </div>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a href="https://github.com/skray/mylibrary" target="_blank" rel="noopener noreferrer" className="nav-link">
                <FontAwesomeIcon icon={faGithub} className="fa-lg"/>
              </a>
            </li>
          </ul>
        </nav>

        <div id="mainContent" className="pt-3 container-fluid">
        
          <input type="text" autoFocus onChange={this.handleSearchChange}/>
          
          <p>{this.state.message}</p>
          
          <ul>
            {this.state.books.map(book => <li key={book.id}>{ book.best_book.title }</li>)}
          </ul>
        </div>
        <div className="footer navbar navbar-expand-lg navbar-light bg-light" >
          Books icon made by&nbsp;
          <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>&nbsp; 
          from&nbsp; 
          <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>&nbsp;
          is licensed by&nbsp; 
          <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" rel="noopener noreferrer" target="_blank">CC 3.0 BY</a>
        </div>
      </div>
    );
  }
}

export default App;
