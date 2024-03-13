import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showError, setShowError] = useState(false);
  const handleLogin = async () => {
    await axios.post('http://localhost:3000/auth/login',{"email":username,"password":password},{ withCredentials: true })
    .then(response => {
      if(response.status === 200){
        setIsLoggedIn(response.data.isLoggedIn);
        window.location.href = '/';
      }
    })
    .catch(error => {
      setIsLoggedIn(false);

      setUsername('');
      setPassword('');

      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    });
  };

  return (
    <div className="login-container">
      {showError && (
        <div className="panel danger">Erro de login. Tente novamente.</div>
      )}
      <h2>Login</h2>
      <input
        id="email"
        type="text"
        placeholder="Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        id="password"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;