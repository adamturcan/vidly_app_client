import React, { Component } from 'react'


class Filtering extends Component {
    state = {  }
    render() { 
        const {onGenreChange,currentFilter,items,textProperty,valueProperty} = this.props

        return (
            <div className="list-group ">
                
                    <a  href="# " className={currentFilter === 'allGenres' ? 'list-group-item list-group-item-action active':'list-group-item list-group-item-action'} onClick={()=>onGenreChange("allGenres")}>All genres</a>
                    {items.map(g=>{return<a href="# " key={g[valueProperty]} className={g[textProperty] === currentFilter?'list-group-item list-group-item-action active':'list-group-item list-group-item-action'} onClick={()=>onGenreChange(g.name)}>{g.name}</a>})}
            
            </div>
            
        );
    }
}
 
export default Filtering;