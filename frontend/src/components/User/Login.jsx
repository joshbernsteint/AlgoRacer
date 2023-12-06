import React, { useState, useRef } from 'react';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';

import styles from './User.module.css';

export default function Login(props) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const errorRef = useRef(undefined);
  const homeRef = useRef(undefined);
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const {data} = await axios.post("/login", {emailAddress: email, password: password});
    if(data.error){
      errorRef.current.innerHTML = `X ${data.error}`;
    }
    else{
      errorRef.current.innerHTML = "";
      props.setLogin({id: data.id, displayName: data.displayName});
      navigate("/");
    }
  }

  return (
    <form action="" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <div className={styles.error}>{error ? error : null}</div>
      <div className={styles.input}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" value={email} onChange={handleEmailChange} />
      </div>
      <div className={styles.input}>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div className={styles.input}>
        <input type="submit" value="Login" />
      </div>
      <div className={styles.input}>
        <p ref={errorRef} id={styles.error_msg}></p>
        <a href="/" hidden ref={homeRef}></a>
        <Link to="/register">Don't have an account? Register Here</Link>
      </div>
    </form>
  )
}