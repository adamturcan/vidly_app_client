import React,{Component} from 'react';
import {getMovies,deleteMovie} from '../services/movieService';
import {getGenres} from '../services/genreService'
import MoviesTable from '../components/moviesTable'
import _ from 'lodash'
import Pagination from './pagination'
import {paginate} from '../utils/paginate'
import Filtering from '../components/filtering'
import {NavLink} from 'react-router-dom'
import { toast } from 'react-toastify';



export default class Movies extends Component {
    state = {
        search:'',
        movies:[],
        moviesByGenre:[],
        genres:[],
        pageSize:4,
        currentPage: 1,
        currentFilter:"allGenres",
        sort:{path:'title',order:'asc'},
        count:''
    };
   
  async componentDidMount(){
      const {data:genres} = await getGenres()
      
      const {data:movies} = await getMovies()

        this.setState({movies,moviesByGenre:movies,genres})

    }


    handleDelete =  async(e)=>{
        const originalMovies = this.state.movies
        const originalMoviesByGenre = this.state.moviesByGenre

        const movies = this.state.movies.filter(m=>m._id !== e.target.value);
        const moviesByGenre = this.state.moviesByGenre.filter(m=>m._id !== e.target.value)
        this.setState({movies, moviesByGenre}) 


        try{
             await deleteMovie(e)
             }
             catch(ex){
                if(ex.response && ex.response.status === 404){
                   toast.error('This movie has already been removed')
                    this.setState({movies:originalMovies,moviesByGenre:originalMoviesByGenre})
                }
                if(ex.response && ex.response.status === 403){
                    toast.error(ex.response.data)
                     this.setState({movies:originalMovies,moviesByGenre:originalMoviesByGenre})
                 }
                 if(ex.response && ex.response.status === 400){
                    toast.error('Please login to make changes')
                     this.setState({movies:originalMovies,moviesByGenre:originalMoviesByGenre})
                 }
             }
        /* const{data:movies} = await getMovies()
        this.setState({movies,moviesByGenre:movies})
      */
    
    }
    handleLike=(movie)=>{
     const movies = [...this.state.movies];
     const index = movies.indexOf(movie);
     movies[index].liked = !movies[index].liked;
     this.setState({movies})
    }
    handlePageChange=(page)=>{

      this.setState({currentPage:page})
    }

    handleGenreChange =(genre)=>{
        this.setState({currentFilter:genre,currentPage:1})
        if(genre === 'allGenres') return this.setState({movies:this.state.moviesByGenre})
        let moviesByGenre = [...this.state.moviesByGenre]
        moviesByGenre = moviesByGenre.filter(m=>m.genre.name === genre)
        this.setState({
            movies:moviesByGenre
        })
       
    }   
    handleSort = (sort)=>{
       
        this.setState({sort})

    }
    
    handleChange = ({currentTarget:input})=>{

        let search = ''
        search = search += input.value
        this.setState({search,currentPage:1})
        

    }
    getPageData = () =>{
        
        const {pageSize,currentPage,movies:allMovies} = this.state
        const reg = new RegExp(this.state.search,'i')
        const movs = [...allMovies]
        const searched = allMovies.filter(m=>{return m.title.match(reg)})
        const sorted = _.orderBy(searched,[this.state.sort.path],[this.state.sort.order])
        return  {movies:paginate(sorted,currentPage,pageSize),count:searched.length,count2:movs};
    }

    render(){
       

        const {user} = this.props
        
        const {movies,count,count2} = this.getPageData()
       
     


       if(count2.length>0){ return(
           

               
           <div className='row'>
            <div className="col-2">
                 <Filtering onGenreChange={this.handleGenreChange} currentFilter={this.state.currentFilter}  items={this.state.genres} textProperty="name" valueProperty="_id"/>    
            </div>
            <div className='col'>
                {user && <NavLink to="/movies/new"><button className="btn btn-primary m-2" onClick={this.handleLink}>New Movie</button></NavLink>}
                <input type="text" className="form-control m-2" placeholder="Search..." value={this.state.search} onChange={this.handleChange}/>
                <p className="m-2">Showing {movies.length} {movies.length >1?'movies':'movie'} out of {this.state.movies.length}</p>
                 <MoviesTable  movies={movies} onDelete={this.handleDelete} onLike={this.handleLike} onSort={this.handleSort} sortColumn={this.state.sort}/>
                <Pagination itemsCount={count} pageSize={this.state.pageSize} onPageChange={this.handlePageChange} currentPage={this.state.currentPage}/>
            </div>
            </div>
            

        )}
        else{
            return(
                <div className="row">
                    <div className="col-2">
                <Filtering onGenreChange={this.handleGenreChange} currentFilter={this.state.currentFilter}  items={this.state.genres} textProperty="name" valueProperty="_id"/> 
                </div>
                <div className="col">
                <div className="header"><p>there are no {this.state.currentFilter !== 'allGenres'?this.state.currentFilter:''} movies in the database</p></div>
                <NavLink to="/movies/new"><button className="btn btn-primary" onClick={this.handleLink}>New Movie</button></NavLink>
                </div>
                </div>
            )
        }


    }
}