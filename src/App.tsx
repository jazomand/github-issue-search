import React from 'react';
import './App.css';
import SearchPage from './presentation/components/SearchPage';

function App(props: any) {
  return (
    <div className="App">
      <SearchPage {...props} />
    </div>
  );
}

export default App;
