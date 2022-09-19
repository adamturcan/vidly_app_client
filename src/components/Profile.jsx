import React, { Component } from "react";
import { getUserData, updateUser } from "./../services/userService";
import Form from "./form";
import Joi from "joi-browser";
import { getCurrentUser } from "../services/authService";
import { toast } from "react-toastify";
import Table from "./table";
import { getRental } from "../services/rentalService";
import { getMovie, getMovies } from "../services/movieService";
import Like from "./like";
import RentalsTable from "./rentalsTable";
import { getGenres } from "../services/genreService";

class Profile extends Form {
  state = {
    data: { name: "" },
    errors: {},
    rents: [],
    sort: { path: "id", order: "asc" },
    user: "",
  };
  schema = {
    name: Joi.string().max(30).min(5),
  };

  async componentDidMount() {
    const { data: user } = await getUserData();

    const rents = [];
    for (let rent of user.rented) {
      const { data: rental } = await getRental(rent);
      const { data: movie } = await getMovie(rental.movie._id);
      movie.dateOut = rental.dateOut;
      console.log(movie);
      rents.push(movie);
    }
    this.setState({ data: { name: user.name }, rents });
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
  handleLike = async (movie) => {};

  render() {
    const user = getCurrentUser();
    console.log(this.state.rents);
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
        <h4 className="m-3">Rents</h4>
        <RentalsTable
          movies={this.state.rents}
          onLike={this.handleLike}
          onSort={this.handleSort}
          sortColumn={this.state.sort}
        />
      </div>
    );
  }
}

export default Profile;
