import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

import Home from './components/Home/Home';
import Learn from './components/Learn/Learn';
import Compete from './components/Compete/Compete';
import Practice from './components/Practice/Practice';
import NavBar from './components/Navbar/Navbar';
import About from './components/About/About';
import Login from './components/User/Login';
import Register from './components/User/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/compete" element={<Compete />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;
