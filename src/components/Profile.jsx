import React, { Component } from "react";
import { getUserData, updateUser } from "./../services/userService";
import Form from "./form";
import Joi from "joi-browser";
import { getCurrentUser } from "../services/authService";
import { toast } from "react-toastify";
import Table from "./table";
class Profile extends Form {
  columns = [{ path: "id", label: "id" }];

  state = {
    data: { name: "" },
    errors: {},
    rents: [],
    sort: { path: "id", order: "asc" },
  };
  schema = {
    name: Joi.string().max(30).min(5),
  };

  async componentDidMount() {
    const { data: user } = await getUserData();
    console.log(user);
    const rents = [];
    for (let rent of user.rented) {
      rents.push({ id: rent });
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
        <Table
          data={this.state.rents}
          columns={this.columns}
          sortColumn={this.state.sort}
          onSort={this.handleSort}
        />
      </div>
    );
  }
}

export default Profile;
