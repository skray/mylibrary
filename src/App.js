import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import booksLogo from "./media/books.png";

import BookSearch from './BookSearch';
import MyBooks from './MyBooks';

function NoMatch() {
  return (
    <div>Not Found</div>
  )
}

function Navigation() {
  return (
    <nav className="header navbar navbar-expand navbar-light bg-light">
      <a className="navbar-brand" href="/">
        <img src={booksLogo} className="d-inline-block mr-2" width="21" alt="" />
        MyLibrary
      </a>
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <NavLink exact className="nav-link" to="/"><FontAwesomeIcon icon={faSearch} className=""/> Search</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/my-books">Shelf</NavLink>
        </li>
      </ul>

      <div className="navbar-nav ml-auto user-actions">
        <span className="nav-item d-none d-md-block">
          <a className="nav-link" href="/">Log In</a>
        </span>
        <span className="nav-item d-none d-md-block">or</span>
        <span className="nav-item d-none d-md-block">
          <a className="nav-link" href="/">Sign Up</a>
        </span>
        <FontAwesomeIcon icon={faUserCircle} className="d-md-none fa-lg"/>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <div className="footer navbar navbar-expand-lg navbar-light bg-light" >
      <span className="attribution">
        <img src={booksLogo} className="" width="10" alt="" /> Icon by&nbsp;
          <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
          &nbsp;via&nbsp;
          <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
          &nbsp;- license&nbsp;
          <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" rel="noopener noreferrer" target="_blank">CC 3.0 BY</a>  
      </span>
      <span className="source-link">
        <a href="https://github.com/skray/mylibrary" target="_blank" rel="noopener noreferrer">
          View the source <FontAwesomeIcon icon={faGithub} className="fa-lg"/>
        </a>  
      </span>
      
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div id="wrapper">
          <Navigation />
          <div id="mainContent" className="container-fluid">
            <Switch>
              <Route exact path="/" component={BookSearch} />
              <Route exact path="/my-books" component={MyBooks} />
              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
