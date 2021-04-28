import React, { Component } from 'react'

class TableHeader extends Component {
    raiseSort = path =>{
        const sort = {...this.props.sort};
        if(sort.path === path)
         sort.order = sort.order === "asc"? "desc":"asc";
         else{
             sort.path = path;
             sort.order = 'asc';
         }
         this.props.onSort(sort)
    }

    renderSortIcon =(column)=>{
        const {sort} = this.props
        if(column.path !== this.props.sort.path) return null
        if(sort.order === 'asc') return <i className="fa fa-sort-asc"></i>
        return <i className="fa fa-sort-desc"></i>
    }

    render() { 
        return (  
            <thead>
                <tr>
                    {this.props.columns.map(column => <th className="clickable" key={column.path || column.key} scope='col' onClick={()=>this.raiseSort(column.path)}>{column.label} {this.renderSortIcon(column)}</th> )}
                </tr>
            </thead>
        );
    }
}
 
export default TableHeader;