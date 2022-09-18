import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);
    if (column.path === "title") {
      return getCurrentUser() ? (
        getCurrentUser().isAdmin ? (
          <Link to={`/movies/${item._id}`}>{_.get(item, column.path)}</Link>
        ) : (
          <Link to={`/movies/${item._id}/info`}>
            {_.get(item, column.path)}
          </Link>
        )
      ) : (
        _.get(item, column.path)
      );
    }

    return _.get(item, column.path);
  };
  state = {};

  createKey = (item, column) => {
    return item._id + (column.path || column.key);
  };

  render() {
    const { data, columns } = this.props;
    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((column) => (
              <td key={this.createKey(item, column)}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
