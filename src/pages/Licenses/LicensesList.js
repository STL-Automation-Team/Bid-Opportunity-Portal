import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link , useParams } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import '../../styles/List.css';
import { RiEditLine, RiDeleteBinLine, RiBookReadFill } from 'react-icons/ri';
import { Modal, Button } from "react-bootstrap";
import { saveAs } from 'file-saver';
import Uploader from '../../components/Uploader';


export default function LicensesList() {

  const [search, setSearch] = useState("");
  const [licenses, setLicenses] = useState([]);
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [selectedColumns,setSelectedColumns] = useState(['id', 'serialNumber', 'software.name', 'Actions', 'licenseType.type', 'region', 'invoiceDate']);
  const [allColumns,setAllColumns] = useState([]);
  // const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {Id}=useParams();

  const handleCloseModal = () => {
    setShowModal(false);
    loadLicenses();
  };

  const handleShowModal = () => {
    setShowModal(true);
  };


  const loadLicenses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/v1/licenses");
      setLicenses(response.data);
      setFilteredLicenses(response.data);
      console.log(response.data);
      setAllColumns(columns);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteLicense=async (id) => {
    handleShowModal();
    await axios.delete(`http://localhost:8080/v1/licenses/${id}`)
    
  }

  const handleColumnSelect = (selector) => {
    if (selector === "software.name" || selector === "service.name" || selector === "licenseType.type" || selector === "manufacturer.name" || selector === "budgetInfo.name") {
      setSelectedColumns([...selectedColumns, "model.name", "service.name","licenseType.type" ,"manufacturer.name","budgetInfo.name"]);
    } else {
      if (selectedColumns.includes(selector)) {
        setSelectedColumns(selectedColumns.filter((col) => col !== selector));
      } else {
        setSelectedColumns([...selectedColumns, selector]);
      }
    }
  };


 const columns = [
  {
    name: "ID",
    selector: 'id',
    sortable: true,
  },
  {
    name: "Serial Number",
    selector: 'serialNumber',
    sortable: true,
  },
  {
    name: "Quantity Used",
    selector: 'quantityUsed',
    sortable: true,
  },
  {
    name: "Valid Through",
    selector: 'validThrough',
    sortable: true,
  },
  {
    name: "Software",
    selector: 'software.name',
    sortable: true,
  },
  {
    name: "Manufacturer",
    selector: 'manufacturer.name',
    sortable: true,
  },
  {
    name: "License Details",
    selector: 'licenseDetails',
    sortable: true,
  },
  {
    name: "License Type",
    selector: 'licenseType.type',
    sortable: true,
  },
  {
    name: "Start Usage Date",
    selector: 'startUsageDate',
    sortable: true,
  },
  {
    name: "Invoice Date",
    selector: 'invoiceDate',
    sortable: true,
  },
  {
    name: "Invoice Number",
    selector: 'invoiceNumber',
    sortable: true,
  },
  {
    name: "Order Number",
    selector: 'orderNumber',
    sortable: true,
  },
  {
    name: "Price",
    selector: 'price',
    sortable: true,
  },
  {
    name: "Service",
    selector: 'service.name',
    sortable: true,
  },
  {
    name: "Remarks",
    selector: 'remarks',
    sortable: true,
  },
  {
    name: "Currency",
    selector: 'currency',
    sortable: true,
  },
  {
    name: "Accounting Id",
    selector: 'accountingId',
    sortable: true,
  },
  {
    name: "Provider",
    selector: 'provider',
    sortable: true,
  },
  {
    name: "Budget Info",
    selector: 'budgetInfo.name',
    sortable: true,
  },
  {
    name: "Region",
    selector: 'region',
    sortable: true,
  },
  {
    name: "Depreciation Rate",
    selector: 'depreciationRate',
    sortable: true,
  },
  {
    name: "Number Bought",
    selector: 'numberBought',
    sortable: true,
  },
  {
    name: "Actions",
    selector: 'Actions',
    cell: (row) => (
      // <div>
      //   <Link className="btn btn-primary mx-1" to={`/editasset/${row.id}`}> Edit </Link>
      //   <Link className="btn btn-danger mx-1" onClick={() => deleteLicense(row.id)}> Delete </Link>
      // </div>
      <div className="actions-container" style={{display: "flex", gap: "0.4rem"}}>
      <Link title="Edit" className="btn btn-primary mx-1 editbtn" to={`/editlicense/${row.id}`}>
        <RiEditLine /> {/* Edit icon */}
      </Link>
      <button title="Delete" className="btn btn-danger mx-1 delbtn" onClick={() => deleteLicense(row.id)}>
        <RiDeleteBinLine /> {/* Delete icon */}
      </button>
      <Link title="More" className="btn btn-secondary mx-1 readbtn" to={`/readlicense/${row.id}`}>
        <RiBookReadFill/> {/* Read icon */}
      </Link>
    </div>
      
    ),
  },

 ];

 const visibleColumns = [...columns.filter((col) => selectedColumns.includes(col.selector))];

 function getValueByPath(object, path) {
  const keys = path.split('.');
  return keys.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, object);
}

 useEffect(()=>{
  loadLicenses();
},[]);

useEffect(() => {
  const result = licenses.filter((license) => {
    return visibleColumns.some((col) => {
      const selector = col.selector;
      const value = selector.includes('.') ? getValueByPath(license,selector) : license[selector];
      return String(value).toLowerCase().includes(search.toLowerCase());
    });
  });
  setFilteredLicenses(result);
  //console.log(result);
}, [search, selectedColumns, licenses]);


const fetchDataToExport = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/v1/licenses/export`, {
      responseType: 'blob',
    });
    const fileName = 'licenses.csv';
    saveAs(response.data,fileName);
  }
  catch(error) {
    console.log(error);

  }
};


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
      minHeight: "50px",
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
    backgroundColor: index % 2 === 0 ? 'lightgray' : 'white',
  }),
};



  return (
   <div className="datatable-container">
   <h3 className="listheading">All Licenses</h3>
<div className="d-flex justify-content-end align-items-center mb-3">

<Dropdown>
          <Dropdown.Toggle variant="primary" className="mx-2 columnselector">
            Select Columns
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-scrollable">
            <div className="dropdown-column-wrapper">
              {columns.map((col) => (
                <div key={col.selector} className="dropdown-item">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={col.selector}
                    checked={selectedColumns.includes(col.selector)}
                    onChange={() => handleColumnSelect(col.selector)}
                  />
                  <label className="form-check-label" htmlFor={col.selector}>
                    {col.name}
                  </label>
                </div>
              ))}
            </div>
          </Dropdown.Menu>
        </Dropdown>
        <Link className="btn btn-primary mx-2 add" to="/addlicense">
          Add License
        </Link>

        <Link
        className="btn btn-primary mx-2 import-btn"
        to={{
          pathname: "/uploader",
          state: { apiEndpoint: "http://localhost:8080/v1/licenses/import" },
        }}
      >
        <b>Import</b>
      </Link>

        <button className="btn btn-primary mx-2 export-btn" onClick={fetchDataToExport}>
    <b>Export</b>
  </button>

      </div>

      

      <DataTable 
      className="custom-datatable"
      columns={visibleColumns}
      data={filteredLicenses}
      pagination
      subHeader
      subHeaderComponent = {
        <input type="text" placeholder="search" className="w-25 form-control my-search" value={search} onChange={(e)=> setSearch(e.target.value)}/>
      }
      customStyles={tableCustomStyles}
          highlightOnHover
          responsive
          striped
          theme="default"
          noDataComponent={<span>No data available</span>}
          conditionalRowStyles={rowCustomStyles}
      />

<Modal show={showModal} onHide={handleCloseModal} >
        <Modal.Header closeButton className="modal-style">
          <Modal.Title>Deletion Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-style">
          <p>Your license has been successfully deleted.</p>
        </Modal.Body>
        <Modal.Footer className="modal-style">
          <Button variant="info" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  )
}



