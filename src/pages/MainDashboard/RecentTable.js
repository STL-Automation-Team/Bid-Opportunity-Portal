import axios from "axios";
import React, { useEffect, useState, Component } from "react";
import DataTable from "react-data-table-component";
import "../../styles/List.css";

export default function RecentTable() {
  const [RecentActivity, setRecentActivity] = useState([]);

  const loadRecentActivity = async () => {
    try {
      const response = await axios.get("http://localhost:8080/v1/activites");
      setRecentActivity(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
    },
    {
      name: "Action",
      selector: "action",
      sortable: true,
    },
    {
      name: "Asset Model",
      selector: "assetModel",
      sortable: true,
    },
    {
      name: "Username",
      selector: "username",
      sortable: true,
    },
    {
      name: "Log Date",
      selector: "logDate",
      sortable: true,
    },
  ];

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const tableCustomStyles = {
    headCells: {
      style: {
        fontSize: "17px",
        fontWeight: "bold",
        justifyContent: "center",
        backgroundColor: "midnightblue",
      },
    },

    rows: {
      style: {
        minHeight: "45px",
      },
    },
    cells: {
      style: {
        justifyContent: "center",
        padding: "0px",
        margin: "0px",
      },
    },
  };

  const rowCustomStyles = {
    style: (index) => ({
      backgroundColor: index % 2 === 0 ? 'red' : 'white',
    }),
  };

  return (
    <div>
      <div
        className="datatable-container dash-table"
        style={{ padding: "0px 45px", margin: "0px" }}
      >
        <DataTable
          className="custom-datatable"
          columns={columns}
          data={RecentActivity}
          pagination
          customStyles={tableCustomStyles}
          highlightOnHover
          responsive
          striped
          theme="default"
          noDataComponent={<span>No data available</span>}
          conditionalRowStyles={rowCustomStyles}
        />
      </div>
    </div>
  );
}
