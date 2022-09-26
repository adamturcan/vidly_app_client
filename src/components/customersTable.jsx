import React, { Component } from 'react'
import Table from "./table";

import { getUserData } from '../services/userService';
export default class CustomersTable extends Component {

  state={
    user:""
  }

  columns = [
    { path: "name", label: "Name" },
    {path:"rents.length",label:"Rented"},  
   
  ];
  
  componentDidMount = async() =>{
    const {data:user} = await getUserData();
    console.log(user)
    this.setState({user})
  }
  render() {
    let { columns } = this;
    if(this.state.user.isAdmin == true){
     columns.push( {label:"Phone",content:customer=> <p>{customer.phone}</p> })
    }


    const { data, onSort ,sort} = this.props;
  
    return (
      <Table
        data={data}
        columns={columns}
        onSort={onSort}
        sortColumn={sort}
      />
    );
  }
  }

