import React from "react";
import Joi from "joi-browser";
import Form from "./form";
import { getCurrentUser, login } from "../services/authService";
import { Redirect } from 'react-router-dom';

class LoginForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };
  schema = {
    email: Joi.string().required().label("Username").email(),
    password: Joi.string().required().label("Password"),
  };
  doSubmit = async () => {
    try {
      await login(this.state.data);
      console.log(this.props.location)
      const { state } = this.props.location;

      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if(getCurrentUser()) return <Redirect to="/"/>



    return (
      <div>
        <h1 className="m-2">Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email", "email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
