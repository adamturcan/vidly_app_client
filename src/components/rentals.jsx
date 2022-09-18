import React from "react";
import Form from "./form";
import "./Styles/steps.css";
import Selector from "./Selector";
import { getMovies } from "./../services/movieService";
import Joi from "joi-browser";
import { getUserData, updateUser } from "./../services/userService";
import { addCustomer } from "../services/customerService";
import { addRental } from "../services/rentalService";
import { toast } from "react-toastify";

class rentalForm extends Form {
  state = {
    data: { movie: "", name: "", phone: "" },
    movies: [],
    movieTitles: [],
    errors: {},
    customerSet: false,
  };
  schema = {
    movie: Joi.string(),
    name: Joi.string().max(30).min(5),
    phone: Joi.string(),
  };

  async componentDidMount() {
    const { data: user } = await getUserData();

    this.setState({
      customerSet: user.isCustomer,
    });
    const { data: movies } = await getMovies();
    const movieTitles = [];
    for (let x of movies) {
      movieTitles.push({ name: x.title });
    }

    this.setState({
      movies,
      movieTitles,
    });
  }

  nextPage = async (e) => {
    const { data: user } = await getUserData();
    if (user.isCustomer) {
      this.setState({
        data: {
          ...this.state.data,
          name: user.customer.name,
          phone: user.customer.phone,
        },
      });
      this.handleSubmit(e);
    }
    let { name, phone } = this.state.data;
    console.log(name, phone);
    if (name && phone) {
      let schema = { name: Joi.string().max(30).min(5), phone: Joi.string() };

      const { error } = Joi.validate({ name, phone }, schema);

      const reg = /\d/gi;
      if (reg.test(name)) {
        {
          const errors = { name: "Name is not allowed to contain numbers" };
          this.setState({ errors });
        }
      } else {
        if (!error) {
          const { data: customer } = await addCustomer({
            name,
            phone,
            isGold: false,
          });
          user.isCustomer = true;
          user.customerId = customer._id;
          await updateUser(user);
          this.setState({ customerSet: true });
        }
      }
    } else {
      let name, phone;

      if (!name) {
        name = "Name is not allowed to be empty";
      }
      if (!phone) {
        phone = "Phone is not allowed to be empty";
      }

      this.setState({
        errors: { name, phone },
      });
    }
  };

  async doSubmit() {
    const { data: user } = await getUserData();
    try {
      let { data: rental } = await addRental({
        customerId: user.customer._id,
        movieId: this.state.data.movie,
      });
      console.log(rental._id);
      user.rented = [...user.rented, rental._id];
      await updateUser(user);
      this.props.history.push("/movies");
      toast.success("Movie successfully rented");
    } catch (error) {
      toast.error("Out of stock");
    }
  }
  handleMovieSet = (e) => {
    let { _id: movie } = this.state.movies.find(
      (movie) => movie.title == e.target.value
    );

    this.setState({
      data: { ...this.state.data, movie },
    });
  };

  render() {
    const { customerSet } = this.state;

    return (
      <div>
        <h1>Rent a movie</h1>
        <div /*style={{border:"solid 1px ", borderRadius:'20px',borderColor:"gray",height:"300px",marginTop:"50px"}}*/
        >
          <form onSubmit={this.handleSubmit}>
            {!customerSet && this.renderInput("name", "Name")}
            {!customerSet && this.renderInput("phone", "Phone")}
            {customerSet && (
              <Selector
                data={this.state.movieTitles}
                selected={this.state.movie}
                onChange={this.handleMovieSet}
                label="Movie"
                error={this.state.errors.movie}
              />
            )}
            {!customerSet && (
              <button
                className="btn btn-primary m-2"
                type="button"
                onClick={this.nextPage}
              >
                Become a customer
              </button>
            )}
            {customerSet && (
              <button
                className="btn btn-primary m-2"
                type="button"
                onClick={this.nextPage}
              >
                Submit
              </button>
            )}

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <span class={`step ${customerSet ? "finish" : "active"} `}></span>
              <span class={`step ${!customerSet ? "" : "active"} `}></span>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default rentalForm;
