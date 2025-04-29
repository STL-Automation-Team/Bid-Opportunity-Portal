import React, { useState, useEffect, useMemo } from "react";
import { COLUMNS } from "./columns";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import axios from "axios";
import "./table.css";
import { GlobalFilter } from "./GlobalFilter";

export const BasicTable = () => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const response =  axios
      .get("http://localhost:8080/v1/licenses")
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchData();
    document.title = `You clicked ${data.length} times`;
  }, []);

  const columns = useMemo(() => COLUMNS, []);
  const row_data = useMemo(() => [...data], [data]);

  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow,
    headerGroups,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns: columns,
      data: row_data,
    },
    useGlobalFilter,
    useSortBy
  );
  const { globalFilter } = state

  return (
    <>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? " 🔽"
                      : " 🔼"
                    : " "}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    </>
  );
};