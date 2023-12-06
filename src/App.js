import React, { Component } from "react";
import Login from "./Login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/fire";
// import "./App.css";
import Dashboard from "./components/Dashboard";
// const auth = getAuth();
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }
  componentDidMount() {
    this.authListener();
  }

  componentWillUnmount() {
    this.authListener();
  }

  setUser(user) {
    this.setState({ user });
  }

  authListener() {
    onAuthStateChanged(auth, (user) => {
      console.log(">>>check user: ", user);
      if (user) {
        this.setState({ user });
        const uid = user.uid;
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    return (
      <div className="App">{this.state.user ? <Dashboard /> : <Login />}</div>
    );
  }
}
