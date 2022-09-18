import React from "react";

import Form from "./form";
import Selector from "./Selector";
import { getGenres } from "../services/genreService";
import Joi from "joi-browser";
import { getMovie, saveMovie, addMovie } from "./../services/movieService";
import { toast } from "react-toastify";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genre: "",
      numberInStock: "",
      dailyRentalRate: "",
      genres: [],
      info: "",
    },
    errors: {},
    selectedGenre: "",
  };
  schema = {
    title: Joi.string().required().label("Title"),
    numberInStock: Joi.number().required().label("Stock"),
    dailyRentalRate: Joi.number().required().label("Rate"),
    genres: Joi.required(),
    info: Joi.string().allow("").optional(),
  };

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      try {
        const { data: movie } = await getMovie(this.props.match.params.id);
        const { data: genres } = await getGenres();
        const { title, numberInStock, dailyRentalRate, genre, info } = movie;
        this.setState({
          data: { title, numberInStock, dailyRentalRate, genres, info },
          selectedGenre: genre.name,
        });
        console.log(movie);
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          toast.error("Movie not found");
          this.props.history.push("/not-found");
        }
      }
    } else {
      const { data: genres } = await getGenres();
      this.setState({
        data: {
          title: "",
          numberInStock: "",
          dailyRentalRate: "",
          genres: genres,
          info: "",
        },
      });
    }
  }

  handleGenreSet = (e) => {
    this.setState({ selectedGenre: e.target.value });
  };

  doSubmit = async () => {
    const _id = this.props.match.params.id;

    const { title, dailyRentalRate, genres, numberInStock, info } =
      this.state.data;
    const genre = genres.find((g) => g.name === this.state.selectedGenre);
    const movie = {
      title,
      dailyRentalRate,
      genreId: genre._id,
      numberInStock,
      info,
    };
    if (_id === "new") {
      console.log(movie);
      await addMovie(movie);
    } else {
      await saveMovie(_id, movie);
    }

    this.props.history.push("/movies");
  };

  render() {
    const { genres } = this.state.data;

    return (
      <div>
        <h1 className="m-2">Movie form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderInput("numberInStock", "Stock")}
          <Selector
            data={genres}
            selected={this.state.selectedGenre}
            onChange={this.handleGenreSet}
            label="Genres"
          />
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderField("info", "Additional Info")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
