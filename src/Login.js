import React, { Component } from 'react'

import { getAuth,createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config/fire';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email:"",
      password:""
    }
  }
  login = () => {
    signInWithEmailAndPassword(auth,this.state.email, this.state.password)
    .then((u)=> {
      // this.props.setUser(u.user);
      console.log('>>>check login: ',u.user);
    }).catch((err) => {
      console.log(err);
    })
  }
  signup = () => {
    console.log(this.state.email, " " ,this.state.password);
    createUserWithEmailAndPassword(auth,this.state.email, this.state.password)
    .then((u)=> {
      console.log('>>>check user: ',u);
    }).catch((err) => {
      console.log(err);
    })
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
    console.log(this.state);
  }
  render() {
    return (
      <div>
         
            <input type="email" id="email" name="email" placeholder="email"
            onChange={this.handleChange}
            value= {this.state.email}>
            </input>

            <input type="password" id="password" name="password" placeholder="password"
            onChange={this.handleChange}
            value= {this.state.password}>            
            </input>
            <button onClick={this.login}>Login</button>
            <button onClick={this.signup}>Signup</button>
         
      </div>
    )
  }
}
