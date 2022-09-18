import React from "react";

export default function Field({ name, label, error, ...rest }) {
  return (
    <div className="m-2">
      <label htmlFor={name}>{label}</label>
      <textarea {...rest} name={name} id={name} className="form-control " />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
