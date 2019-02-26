import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import booksLogo from "./media/books.png";

import BookSearch from './BookSearch';

function Navigation() {
  return (
    <nav className="header navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">
        <img src={booksLogo} className="d-inline-block mr-2" width="21" alt="" />
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
  );
}

function Footer() {
  return (
    <div className="footer navbar navbar-expand-lg navbar-light bg-light" >
      Books icon made by&nbsp;
      <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>&nbsp;
      from&nbsp;
      <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>&nbsp;
      is licensed by&nbsp;
      <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" rel="noopener noreferrer" target="_blank">CC 3.0 BY</a>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <div id="wrapper">
        <Navigation />
        <div id="mainContent" className="container-fluid">
          <BookSearch />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
