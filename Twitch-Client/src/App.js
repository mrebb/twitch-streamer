import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import {Provider} from 'react-redux';
import './App.css';
import './components/styles/Main.css';
import './components/styles/Header.css';
import Header from './components/Header.jsx';
import Login from './containers/Login.jsx';
import Dashboard from './containers/Dashboard.jsx';
import Callback from './components/Callback.jsx';
import store from './store/store.js';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store= {store}>
          <Fragment>
            <div className="App">
              <Header/>
              <Route exact path="/" component={Login} />
              <Route exact path="/callback" component={Callback} />
              <Route exact path="/dashboard" component={Dashboard} />
            </div>
          </Fragment>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
