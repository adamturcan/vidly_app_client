import React, { Component } from "react";
import TableBody from "./tableBody";
import TableHeader from "./tableHeader";

class Table extends Component {
  render() {
    const { data, onSort, columns, sortColumn } = this.props;
    console.log(sortColumn);
    return (
      <table className="table m-2">
        <TableHeader columns={columns} sort={sortColumn} onSort={onSort} />
        <TableBody data={data} columns={columns} />
      </table>
    );
  }
}

export default Table;
