import React, { Component } from "react";

class Selector extends Component {
  render() {
    return (
      <div>
        <div className="form-group m-2">
          <label htmlFor="genres">{this.props.label}</label>
          <select
            name="genres"
            className="custom-select"
            required
            onChange={this.props.onChange}
          >
            <option value="">Open this select menu</option>
            {this.props.data.map((d) => (
              <option
                key={d._id}
                value={d.name}
                selected={this.props.selected === d.name ? true : false}
              >
                {d.name}
              </option>
            ))}
          </select>
          {this.props.error && (
            <div className="alert alert-danger">{this.props.error}</div>
          )}
        </div>
      </div>
    );
  }
}

export default Selector;
