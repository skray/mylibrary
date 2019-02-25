import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import '../node_modules/bootstrap/scss/bootstrap.scss';
import './index.scss';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
