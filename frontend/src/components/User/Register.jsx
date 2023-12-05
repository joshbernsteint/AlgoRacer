import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './User.module.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // console.log(password, email, username)
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
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div className={styles.input}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" value={email} onChange={handleEmailChange} />
      </div>
      <div className={styles.input}>
        <input type="submit" value="Register" />
      </div>
      <div className={styles.input}>
        <Link to="/login">Already have an account? Login Here</Link>
      </div>
    </form>
  )
}