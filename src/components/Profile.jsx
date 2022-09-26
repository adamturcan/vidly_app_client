import React, { Component } from "react";
import { getMovie ,deleteMovie} from "../services/movieService";
import MoviesTable from "../components/moviesTable";
import _ from "lodash";
import Pagination from "./pagination";
import { paginate } from "../utils/paginate";
import Filtering from "../components/filtering";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserData, updateUser } from "../services/userService";
import Joi from "joi-browser";
import Form from "./form"
import RentalsTable from "./rentalsTable"
import {getRental, returnRental} from "../services/rentalService"
import {getCurrentUser} from "../services/authService"





class Profile extends Form{
  state = {
    data: { name: "" },
    errors: {},
    rents: [],
    defRents:[],
    filters:[{name:"All Rents"},{name:"Favorite"}],
    sort: { path: "title", order: "asc" },
    user: "",
    currentFilter:"Active Rents",
    count:"",
    currentPage:"",
    pageSize:4,
    liked:[]
  };
  schema = {
    name: Joi.string().max(30).min(5),
  };

  async componentDidMount() {
    const { data: user } = await getUserData();
    this.setState({ user,data: { name: user.name }});
  
      const rents = [];
      if(user.isCustomer){
        for (let rent of user.customer.rents) {

          const { data: rental } = await getRental(rent);
       try{
        const { data: movie } = await getMovie(rental.movie._id);
        movie.dateOut = rental.dateOut;
        if(rental.dateReturned){
          movie.dateReturned = rental.dateReturned
        }
        movie.rentId = rental._id
        rents.push(movie);
       }
       catch(ex){
          continue
       }
      }
      }
      
     let liked  =[]
    
     for(let like of user.liked){
       try{
         let {data:mov}= await getMovie(like)
         mov.liked = true;
         liked.push(mov)
       }
       catch(ex){
           continue;
       }
           
     }
    
     this.setState({
       liked
     })
     
       
      

      this.setState({ rents:rents.filter(r=>r.dateReturned == undefined) ,defRents:rents,count:rents.filter(r=>r.dateReturned == undefined).length})
   
    

   
  }
  apply = async () => {
    const { data: user } = await getUserData();
    user.name = this.state.data.name;
    console.log(user);
    await updateUser(user);
    toast.info("changes wil be visible when re-logged in");
  };
  handleSort = (sort) => {
    this.setState({ sort });
  };

  


  handleReturn = async (e)=>{
    await returnRental(e.target.value)

    const { data: user } = await getUserData();

    const rents = [];
    for (let rent of user.customer.rents) {
      const { data: rental } = await getRental(rent);
      try{
       const { data: movie } = await getMovie(rental.movie._id);
       movie.dateOut = rental.dateOut;
       if(rental.dateReturned){
         movie.dateReturned = rental.dateReturned
       }
       movie.rentId = rental._id
       rents.push(movie);
      }
      catch(ex){
         continue
      }
    }
    if(this.state.currentFilter == "Active Rents"){
      this.setState({ data: { name: user.name }, rents:rents.filter(m=>m.dateReturned == undefined) ,defRents:rents});
    }
    else{
      this.setState({ data: { name: user.name }, rents,defRents:rents});
    }
    





  }
  handleRentChange = async (filter) => {
    this.setState({ currentFilter: filter });
    if(filter == "Active Rents"){
      let movies = this.state.defRents.filter(m=>m.dateReturned == undefined)
      this.setState({rents:movies,currentPage:1})
    }
    if(filter == "All Rents"){
      this.setState({rents:this.state.defRents,currentPage:1})
      
    }
    if(filter == "Favorite"){
      let rents  =[]
      const {data:user} = await getUserData()
      console.log(user.liked)
      for(let like of user.liked){
        try{
          let {data:movie}= await getMovie(like)
          rents.push(movie)
        }
        catch(ex){
            continue;
        }
            
      }
     
      this.setState({
        rents,count:rents.length,currentPage:1
      })
      
    }
    

  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  getPageData = () => {
    const { pageSize, currentPage, rents,liked } = this.state;
    
    const sorted = _.orderBy(
      rents,
      [this.state.sort.path],
      [this.state.sort.order]
    );
    const sortedLiked = _.orderBy(
      liked,
      [this.state.sort.path],
      [this.state.sort.order]
    );
 
    return {
      rents: paginate(sorted, currentPage, pageSize),
      count: sorted.length,
      countLike:sortedLiked.length,
      liked:paginate(sortedLiked, currentPage, pageSize)
    };
  };

  handleLike = async(movie)=>{
    try {
      const { user } = this.state;

      let liked;

      let Userliked = user.liked;

      const a = Userliked.find((i) => i === movie._id);

      if (a) {
        liked = true;
      }

      
      const movies = [...this.state.liked];
      const index = movies.indexOf(movie);
      movies[index].liked = !liked;
      this.setState({ liked:movies });

      liked
        ? user.liked.splice(user.liked.indexOf(movie._id), 1)
        : user.liked.push(movie._id);

      const likes = []
        for(let like of user.liked){
          try{
            let {data:movie}= await getMovie(like)
            likes.push(movie)
          }
          catch(ex){
              continue;
          }
              
        }



      this.setState({ user,liked:likes});
      

      await updateUser(user);




    } catch (ex) {
      return;
    }
  }
  handleDelete = async(e)=>{

    console.log(e.target.value)
    const originalLiked = this.state.liked;
    const originalRents = this.state.rents;
    const originalDefRents = this.state.defRentes;

    const rents = this.state.rents.filter((m) => m._id !== e.target.value);
    const defRents = this.state.defRents.filter(
      (m) => m._id !== e.target.value
    );
    const liked = this.state.liked.filter(
      (m) => m._id !== e.target.value
    );
    this.setState({ rents, defRents,liked });

    try {
      await deleteMovie(e);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This movie has already been removed");
        this.setState({
          rents: originalRents,
          defRents: originalDefRents,
          liked:originalLiked
        });
      }
      if (ex.response && ex.response.status === 403) {
        toast.error(ex.response.data);
        this.setState({
          rents: originalRents,
          defRents: originalDefRents,
          liked:originalLiked
        });
      }
      if (ex.response && ex.response.status === 400) {
        toast.error("Please login to make changes");
        this.setState({
          rents: originalRents,
          defRents: originalDefRents,
          liked:originalLiked
        });
      }
    }
  }
  render() {

    const { rents, count,countLike,liked } = this.getPageData();
    console.log(liked)
    const user = getCurrentUser();
    return (
      <div>
        <h1 className="m-2">{user.name}</h1>
        <h6 className="m-5">
          {this.renderInput("name", "Change your Nickame")}
          <button
            className="btn btn-primary m-2"
            type="button"
            onClick={this.apply}
          >
            Apply changes
          </button>
        </h6>
        <div className="row">
          <div className="col-2"><Filtering
        
        onFilterChange={this.handleRentChange}
        currentFilter={this.state.currentFilter}
        items={this.state.filters}
        textProperty="name"
        valueProperty="name"
        def="Active Rents"
      />
          </div>
          <div className="col">
            {((this.state.currentFilter == "Active Rents" || this.state.currentFilter == "All Rents")&& rents.length == 0)&&
            <div className="header">  <p>
            You currently have no Rented Movies
          </p></div>
            
            }

{(this.state.currentFilter != "Favorite" && rents.length >0) &&  <p>
               Showing {rents.length} {rents.length > 1 ?"rents":"rent"} out of {this.state.rents.length}
             </p> }  
             { (this.state.currentFilter != "Favorite" && rents.length != 0 ) &&  <RentalsTable
                movies={rents}
                onSort={this.handleSort}
                sort={this.state.sort}
                onReturn={this.handleReturn}
                />
             }  
             {(this.state.currentFilter == "Favorite" && liked.length == 0)&& <div className="header">
               <p>You have no liked Movies</p>
               </div>}

             {(this.state.currentFilter == "Favorite" && liked.length >0) &&  <p>
               Showing {liked.length} {liked.length > 1 ?"movies":"movie"} out of {this.state.liked.length}
             </p> }  
              
             {(this.state.currentFilter == "Favorite" && liked.length != 0)&& <MoviesTable
              movies={liked}
              onDelete={this.handleDelete}
              onLike={this.handleLike}
              onSort={this.handleSort}
              sortColumn={this.state.sort}
             />}
             <Pagination
              itemsCount={this.state.currentPage == "Favorite"?countLike:count}
              pageSize={this.state.pageSize}
              onPageChange={this.handlePageChange}
              currentPage={this.state.currentPage}
            />
          </div>
        </div>
        </div>
        
    );
  }
}

export default Profile;
