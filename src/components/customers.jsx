import React, { Component } from "react";
import _ from "lodash";
import Pagination from "./pagination";
import { paginate } from "../utils/paginate";
import Joi from "joi-browser";
import CustomersTable from "./customersTable"
import {getCustomers} from "./../services/customerService"





class Customers extends Component{
  state = {
    data: { name: "" },
    errors: {},
    customers: [],
    sort: { path: "name", order: "asc" },    
    count:"",
    currentPage:"",
    pageSize:4,
  };


  async componentDidMount() {
    
    const {data} = await getCustomers();
    let customers = []

    for(let customer of data){
      customers.push({name:customer.name,isGold:customer.isGold,rents:[...customer.rents],phone:customer.phone})
    }
    this.setState({customers,currentPage:1})
    
    
   
  }
  
  


 
  
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handleSort = (sort) => {
    this.setState({ sort });
  };

  getPageData = () => {
    const { pageSize, currentPage, customers } = this.state;
    
    const sorted = _.orderBy(
      customers,
      [this.state.sort.path],
      [this.state.sort.order]
    );
      
 
    return {
      customers: paginate(sorted, currentPage, pageSize),
      count: sorted.length,
   
    };
  };

 
  render() {

    const { customers, count } = this.getPageData();
    
    
    return (
      <div>
        <h1 className="m-2">Customers</h1>
       
        <div className="row">
           {customers.length > 0 && 
           <CustomersTable
           data={customers}
           onSort={this.handleSort}
           sort={this.state.sort}
           
           />
           
           
           
           }
          </div>
         


        </div>
        
    );
  }
}

export default Customers;
