import React from 'react'
import Form from './form'
import Joi from 'joi-browser'
import {register} from '../services/userService'
import { loginWithJwt } from './../services/authService';
import { Redirect } from 'react-router-dom';
import {getCurrentUser} from '../services/authService'

class RegisterForm extends Form {
    state = {  
        data:{email:"",password:"",name:""},
        errors:{}
    }
    schema = {
        email: Joi.string().required().label('Email').email(),
        password: Joi.string().required().label('Password').min(5),
        name: Joi.string().required().label('Name')
    }

    doSubmit = async() => {

    try{
         const response = await register(this.state.data)
         loginWithJwt(response.headers['x-auth-token'])
         window.location = '/'
    }
    catch(ex){
        if(ex.response && ex.response.status === 400){
            const errors = {...this.state.errors};
            errors.email = ex.response.data;
            this.setState({errors});
        }
    }

    
    }

    render() { 
        if(getCurrentUser()) return <Redirect to="/"/>
        return ( 
            <div>
            <h1 className="m-2">Register</h1>
            <form onSubmit={this.handleSubmit}>
            {this.renderInput('email','Email','email')}
            {this.renderInput('password',"Password","password")}
            {this.renderInput('name',"Name",'text')}
            {this.renderButton('Register')}
            </form>
            </div>
         );
    }
}
 
export default RegisterForm;