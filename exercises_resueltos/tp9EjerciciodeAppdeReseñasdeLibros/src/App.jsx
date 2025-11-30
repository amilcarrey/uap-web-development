import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
