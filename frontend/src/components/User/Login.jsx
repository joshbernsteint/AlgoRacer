import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './User.module.css';

export default function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // console.log(password, email)
  }

  return (
    <form action="" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <div className={styles.error}>{error ? error : null}</div>
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
        <Link to="/login">Login</Link>
      </div>
    </form>
  )
}