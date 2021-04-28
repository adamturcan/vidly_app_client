import React from "react";

export default function Input({ name, label,error,...rest }) {
  return (
    <div className="m-2">
      <label htmlFor={name}>{label}</label>
      <input
        {...rest}
        name={name}
        id={name}
        className="form-control "
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
