import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GithubIssueRepository from './data-github/GithubIssuesRepository';
import IssueInteractor from './domain/interactors/IssueInteractor';
import configureStore from './presentation/components/redux/store';
import { Provider } from 'react-redux'

//issueInteractor as prop for plain react and inside a provider for redux
const issueInteractor = new IssueInteractor(new GithubIssueRepository());
const store = configureStore(issueInteractor);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App issueInteractor={issueInteractor} />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
