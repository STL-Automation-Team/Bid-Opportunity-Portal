import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/readpage.css";

export default function ReadUser() {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const { id } = useParams();

  useEffect(() => {
    loaduser();
  }, []);

  const loaduser = async () => {
    const res = await axios.get(`http://localhost:8080/v1/users/${id}`);
    setUser(res.data);
    console.log(res.data);
  };

  return (
    <div className="read-container">
      <div className="page-top">
        {/* <Link className="btn btn-primary back-btn" to="/assetslist">
          back
        </Link> */}
        <h4 className="heading"><b>User Id: {id}</b></h4>
      </div>

      <div className="readlist">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">ID</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{user.id}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">First Name</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{user.firstName}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Last Name</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{user.lastName}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Email</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{user.email}</span>
            </div>
          </li>
        </ul>
      </div>
      <Link className="btn btn-danger back-btn" to="/userslist">
          back
        </Link>
    </div>
  );
}
