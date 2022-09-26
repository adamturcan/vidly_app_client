
import {NavLink} from 'react-router-dom'
import React from 'react'
 
const NavBar = ({user})=> {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light ">
  <NavLink className="navbar-brand" to="">Rently</NavLink>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav">
        <NavLink className="nav-link" to="/movies">Movies</NavLink>
        <NavLink className="nav-link" to="/customers">Customers</NavLink>
        <NavLink className="nav-link" to="/rentals">Rental</NavLink>
       {!user && 
       <React.Fragment>
       <NavLink className="nav-link" to="/login">Login</NavLink>
        <NavLink className="nav-link" to='/register'>Register</NavLink>
        </React.Fragment>
} {user && 
       <React.Fragment>
       <NavLink className="nav-link" to="/profile">{user.name}</NavLink>
        <NavLink className="nav-link" to='/logout'>Logout</NavLink>
        </React.Fragment>
}
    </ul>
  </div>
</nav>
    )
}

 
export default NavBar;