import React from 'react';
import './css/style.css';
import TaskList from './components/TaskList';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <TaskList />
    </div>
  );
}

export default App;
