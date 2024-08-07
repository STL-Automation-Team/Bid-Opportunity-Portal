import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { RiBookReadFill, RiDeleteBinLine, RiEditLine } from 'react-icons/ri';
import { Link, useParams } from 'react-router-dom';
import '../../styles/List.css';



export default function AssetList() {

  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedColumns,setSelectedColumns] = useState(['id', 'serialNumber', 'model.name', 'Actions', 'currency', 'barcode', 'orderNumber','service.name']);
  const [allColumns,setAllColumns] = useState([]);
  //const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);



  const {Id}=useParams();

  const handleCloseModal = () => {
    setShowModal(false);
    loadAssets();
  };

  const handleShowModal = () => {
    setShowModal(true);
  };
  

  const loadAssets = async () => {
    try {
      const response = await axios.get("http://localhost:8080/v1/assets");
    setAssets(response.data);
    setFilteredAssets(response.data);
      setAllColumns(columns);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteLicense=async (id) => {
    handleShowModal();
    await axios.delete(`http://localhost:8080/v1/assets/${id}`)
    
  }

  const handleColumnSelect = (selector) => {
    if (selector === "model.name" || selector === "service.name") {
      setSelectedColumns([...selectedColumns, "model.name", "service.name"]);
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
    name: "Require Support",
    selector: 'requireSupport',
    sortable: true,
    cell: (row) => String(row.requireSupport),
  },
  {
    name: "Barcode",
    selector: 'barcode',
    sortable: true,
  },
  {
    name: "Order Number",
    selector: 'orderNumber',
    sortable: true,
  },
  {
    name: "Provider",
    selector: 'provider',
    sortable: true,
  },
  {
    name: "Budget Info",
    selector: 'budgetInfo',
    sortable: true,
  },
  {
    name: "Model",
    selector: 'model.name',
    sortable: true,
  },
  {
    name: "Invoice Number",
    selector: 'invoiceNumber',
    sortable: true,
  },
  {
    name: "Invoice Date",
    selector: 'invoiceDate',
    sortable: true,
  },
  {
    name: "Depreciation Rate",
    selector: 'depreciationRate',
    sortable: true,
  },
  {
    name: "Force Depreciation",
    selector: 'forceDepreciation',
    sortable: true,
    cell: (row) => String(row.forceDepreciation),
  },
  {
    name: "Depreciation End Date",
    selector: 'depreciationEndDate',
    sortable: true,
  },
  {
    name: "Buyout Date",
    selector: 'buyoutDate',
    sortable: true,
  },
  {
    name: "Start Usage",
    selector: 'startUsage',
    sortable: true,
  },
  {
    name: "Currency",
    selector: 'currency',
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
    name: "Actions",
    selector: 'Actions',
    maxWidth: '500px',
    cell: (row) => (
      <div className="actions-container" style={{display: "flex", gap: "0.4rem"}}>
      <Link title="Edit" className="btn btn-primary mx-1 editbtn" to={`/editasset/${row.id}`}>
        <RiEditLine /> {/* Edit icon */}
      </Link>
      <button title="Delete" className="btn btn-danger mx-1 delbtn" onClick={() => deleteLicense(row.id)}>
        <RiDeleteBinLine /> {/* Delete icon */}
      </button>
      <Link title="More" className="btn btn-secondary mx-1 readbtn" to={`/readasset/${row.id}`}>
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
  loadAssets();
},[]);

useEffect(() => {
  const result = assets.filter((asset) => {
    return visibleColumns.some((col) => {
      const selector =col.selector;
      const value = selector.includes('.') ? getValueByPath(asset, selector) : asset[selector];
      return String(value).toLowerCase().includes(search.toLowerCase());
    });
  });
  setFilteredAssets(result);
  //console.log(result);
}, [search, selectedColumns, assets]);


const fetchDataToExport = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/v1/assets/export`, {
      responseType: 'blob',
    });
    const fileName = 'assets.csv';
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

//---------------------------------------------------------------------------------------------------------
//below code is for exporting data from UI , only visible columns data is downloaded
// const exportToCSV = () => {
//   // Add the column headers
//   let csvContent = visibleColumns.map((column) => column.name).join(',') + '\r\n';

//   // Add the data rows
//   filteredAssets.forEach((asset) => {
//     const rowData = visibleColumns.map((column) => {
//       const value = asset[column.selector];
//       return typeof value === 'string' ? `"${value}"` : value;
//     });
//     csvContent += rowData.join(',') + '\r\n';
//   });

//   // Create a Blob with the CSV content
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

//   // Save the Blob as a CSV file
//   saveAs(blob, 'assets.csv');
// };
// -----------------------------------------------------------------------------------------------



  return (
   <div className="datatable-container">
   <h3 className="listheading"><b>All Assets</b></h3>
<div className="d-flex justify-content-end align-items-center mb-3">

<Dropdown>
          <Dropdown.Toggle variant="primary" className="mx-2 columnselector">
            <b>Select Columns</b>
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
        <Link className="btn btn-primary mx-2 add" to="/addasset">
          <b>Add Asset</b>
        </Link>

        <Link className="btn btn-primary mx-2 import-btn" to="/uploader">
          <b>Import</b>
        </Link>

        <button className="btn btn-primary mx-2 export-btn" onClick={fetchDataToExport}>
    <b>Export</b>
  </button>

      </div>

      <DataTable 
      className="custom-datatable"
      columns={visibleColumns}
      data={filteredAssets}
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
          <p>Your asset has been successfully deleted.</p>
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



