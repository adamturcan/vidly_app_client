import React , {Component}from 'react';
import {Route,Switch,Redirect} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Movies from './components/Movies';
import Customers from './components/customers';
import Rentals from './components/rentals';
import NotFound from './components/notfound'
import NavBar from './components/navbar';
import MovieForm from './components/movieform';
import LoginForm from './components/loginForm';
import RegisterForm from './components/registerForm';
import Logout from './components/logout'
import ProtectedRoute from './components/protectedRoute';
import { getCurrentUser } from './services/authService';
import 'react-toastify/dist/ReactToastify.css'
import './App.css';





class App extends Component {
  state={

  }

  componentDidMount() {
    const user = getCurrentUser()
    this.setState({user})

  }
  

 
render(){
  return (
    <div>
      <ToastContainer/>
    <NavBar user={this.state.user}/>
    <main className="container">
      <Switch>
      <Route path="/register" component={RegisterForm}/>
      <Route path="/login" component={LoginForm}/> 
      <Route path="/logout" component={Logout}/>    
      <ProtectedRoute path="/movies/:id" component={MovieForm}/>
      <Route path="/movies" render={props =><Movies {...props} user={this.state.user}/>}/>
      <Route path="/customers" component={Customers}/>
      <Route path="/not-found" component={NotFound}/>
      <Route path="/rentals" component={Rentals}/>
      <Redirect from='/' exact to='/movies'/>
      <Redirect  to='/not-found'/>
      </Switch>
    </main>
    </div>
  );
 }
}

export default App;
