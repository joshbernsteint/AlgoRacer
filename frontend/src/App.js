import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

import Home from './components/Home/Home';
import Learn from './components/Learn/Learn';
import Compete from './components/Compete/Compete';
import Practice from './components/Practice/Practice';
import NavBar from './components/Navbar/Navbar';
import About from './components/About/About';
import Login from './components/User/Login';
import Register from './components/User/Register';
import Leaderboard from './components/Leaderboard/Leaderboard';

function App() {
  const [loginData, setLoginData] = useState(null);
  return (
    <Router>
      <div className="App">
        <NavBar userData={loginData} setLogin={setLoginData}/>
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home userData={loginData} setLogin={setLoginData}/>} />
            <Route path="/learn" element={<Learn userData={loginData} setLogin={setLoginData}/>} />
            <Route path="/practice" element={<Practice userData={loginData} setLogin={setLoginData}/>} />
            <Route path="/compete" element={<Compete userData={loginData} setLogin={setLoginData}/>} />
            <Route path="/about" element={<About userData={loginData} setLogin={setLoginData}/>} />
            <Route path="/login" element={<Login userData={loginData} setLogin={setLoginData}/>} />
            <Route path="/register" element={<Register userData={loginData} setLogin={setLoginData}/>} />
            <Route path="/leaderboards" element={<Leaderboard userData={loginData} setLogin={setLoginData}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;
