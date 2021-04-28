import React, { Component } from 'react'
import Like from './like'
import Table from './table'
import {getCurrentUser} from '../services/authService'

class MovieTable extends Component {
    columns =[
        {path:'title', label:"Title"},
        {path:"genre.name", label:"Genre"},
        {path:"numberInStock", label:"Stock"},
        {path:"dailyRentalRate", label:"Rate"},
        { key:"like", content:movie=><Like liked={movie.liked} onClick={()=>{this.props.onLike(movie)}}/>},
    ]
    
    


    render() { 
        let {columns} = this

        if(getCurrentUser() && getCurrentUser().isAdmin ){
          columns = [...columns,{key:'delete', content:movie=><button value={movie._id} className="btn btn-danger" onClick={this.props.onDelete}>Delete</button>},]
        }



        const {movies,onSort} = this.props


        return ( 
           <Table data={movies} columns={columns} onSort={onSort} sortColumn={this.props.sortColumn}/>


         );
    }
}
 
export default MovieTable;