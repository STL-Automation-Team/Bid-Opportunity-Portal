import React from "react";

const ListField = ({ label, value }) => (
  <li className="list-group-item">
    <div className="list-group-item-fixed">
      <strong className="list-group-left">{label}</strong>
      <strong className="list-group-middle">:</strong>
      <span className="list-group-right">{value}</span>
    </div>
  </li>
);

export default ListField;
