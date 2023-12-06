import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './User.module.css';
import axios from 'axios'

export default function Register(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const errorRef = useRef(undefined);
  const homeRef = useRef(undefined);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()

    const {data} = await axios.post("/register", {emailAddress: email, password: password, displayName: username});
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
      <h1>Register</h1>
      <div className={styles.error}>{error ? error : null}</div>
      <div className={styles.input}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" value={username} onChange={handleUsernameChange} />
      </div>
      <div className={styles.input}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" value={email} onChange={handleEmailChange} />
      </div>
      <div className={styles.input}>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div className={styles.input}>
        <input type="submit" value="Register" />
      </div>
      <div className={styles.input}>
        <p ref={errorRef} id={styles.error_msg}></p>
        <a href="/" hidden ref={homeRef}></a>
        <Link to="/login">Already have an account? Login Here</Link>
      </div>
    </form>
  )
}