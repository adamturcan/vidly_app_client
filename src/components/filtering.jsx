import React, { Component } from 'react'



class Filtering extends Component {
    state = {  }
    render() { 
        const {onFilterChange,currentFilter,items,textProperty,valueProperty,def} = this.props
     
        return (
            <div className="list-group ">
                
                    <a  href="# " className={currentFilter === def ? 'list-group-item list-group-item-action active':'list-group-item list-group-item-action'} onClick={()=>onFilterChange(def)}>{def}</a>
                    {items.map(g=>{return<a href="# " key={g[valueProperty]} className={g[textProperty] === currentFilter?'list-group-item list-group-item-action active':'list-group-item list-group-item-action'} onClick={()=>onFilterChange(g.name)}>{g.name}</a>})}
                       
            </div>
            
        );
    }
}
 
export default Filtering;