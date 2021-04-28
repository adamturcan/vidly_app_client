import React, { Component } from "react";
import PropTypes from 'prop-types';
import _ from "lodash";

class Pagination extends Component {
  state = {};
  render() {
    const { itemsCount, pageSize,currentPage, onPageChange } = this.props;
    const pagesCount = Math.ceil(itemsCount / pageSize);
    if (pagesCount === 1) return null;
    const pages = _.range(1, pagesCount + 1);
    return (
      <nav aria-label="Page navigation">
        <ul className="pagination m-2">
          {pages.map((p) => (
            <li key={p} className={p === currentPage? 'page-item active':'page-item'}>
              <a href="# "className="page-link"onClick={() => {onPageChange(p);}}>
                {p}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

Pagination.propTypes = {
  itemsCount:PropTypes.number.isRequired,
   pageSize:PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange:PropTypes.func.isRequired
  
};


export default Pagination;
