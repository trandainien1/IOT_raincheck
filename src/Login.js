import React, { Component, useRef, useState } from "react";

import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./config/fire";

import logo from "./imgs/logo.svg";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const login = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((u) => {
        // this.props.setUser(u.user);
        console.log(">>>check login: ", u.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="Login">
      <div className="login">
        <img src={logo} alt="rain-check-logo" className="logo" />
        <form action="">
          <input
            type="email"
            className="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
          <input
            type="password"
            id="password"
            className="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
          <input type="submit" value="LOGIN" onClick={(e) => login(e)} />
        </form>
      </div>
    </div>
  );
};

export default Login;
