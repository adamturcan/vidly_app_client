import React, { Component } from "react";
import Like from "./like";
import Table from "./table";
import { getCurrentUser } from "../services/authService";

class RentalsTable extends Component {
  columns = [
    { path: "title", label: "Title" },
    { path: "genre.name", label: "Genre" },
    { path: "dateOut", label: "Date out" },
    {path: "dateReturned",label:"Date Returned"},
    {
      key: "Return",
      content: (movie) => (
        movie.dateReturned == undefined && <button
          value={movie.rentId}
          className="btn btn-info"
          onClick={this.props.onReturn}
        >
          Return
        </button>
      ),
    },
  
  ];

  render() {
    let { columns } = this;

    const { movies, onSort } = this.props;

    return (
      <Table
        data={movies}
        columns={columns}
        onSort={onSort}
        sortColumn={this.props.sort}
      />
    );
  }
}

export default RentalsTable;
