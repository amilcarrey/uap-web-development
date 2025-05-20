import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import ChangeList from './components/change-list';

const list1 = [1,2,3,4,5,6,7,8]
const list2 = [10,11,12,13,14,15,16,17]

function App() {
  const [tasks, setTasks] = useState(list1);
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          {loading && <div className="loading">Loading...</div>}
          {!loading && tasks.map((task, index) => (
            <div key={index} className="task">
              <span>{task}</span>
            </div>
          ))}
          <ChangeList setTasks={setTasks} setLoading={setLoading} newValue={list2} />
        </div>
      </header>
    </div>
  );
}

export default App;
