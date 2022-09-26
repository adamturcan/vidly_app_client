import React, { Component } from "react";
import { getMovie } from "./../services/movieService";
import { toast } from "react-toastify";
class MovieInfo extends Component {
  state = {
    data: {
      title: "",
      genre: "",
      numberInStock: "",
      dailyRentalRate: "",
      info: "",
    },
  };

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      try {
        const { data: movie } = await getMovie(this.props.match.params.id);
        const { title, numberInStock, dailyRentalRate, genre, info } = movie;
        this.setState({
          data: { title, numberInStock, dailyRentalRate, genre, info },
        });
        console.log(movie);
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          toast.error("Movie not found");
          this.props.history.push("/not-found");
        }
      }
    }
  }

  render() {
    return (
      <div>
        <h1 className="m-1">{this.state.data.title}</h1>
        <h5 className="m-3">Genre: {this.state.data.genre.name}</h5>
        <h5 className="m-3">
          Rating: {this.state.data.dailyRentalRate} starts "star icon"
        </h5>
        <h5 className="m-3">Stock: {this.state.data.numberInStock} pcs.</h5>
        <div style={{ "margin-top": "50px" }}> {this.state.data.info}</div>
      </div>
    );
  }
}

export default MovieInfo;
