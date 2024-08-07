import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link , useParams } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import '../../../styles/List.css';
import { RiEditLine, RiBookReadFill } from 'react-icons/ri';


export default function ModelList() {
    const [search, setSearch] = useState("");
    const [models, setModels] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [selectedColumns,setSelectedColumns] = useState(['id', 'name', 'manufacturer.name', 'category.name','Actions']);
    const [allColumns,setAllColumns] = useState([]);
    //const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
  
  
  
    const {Id}=useParams();
  
    // const handleCloseModal = () => {
    //   setShowModal(false);
    //   loadAssets();
    // };
  
    // const handleShowModal = () => {
    //   setShowModal(true);
    // };
    
  
    const loadModels = async () => {
      try {
        const response = await axios.get("http://localhost:8080/v1/settings/models");
      setModels(response.data);
      setFilteredModels(response.data);
        setAllColumns(columns);
      } catch (error) {
        console.log(error);
      }
    }
  
    // const deleteModel=async (id) => {
    //   handleShowModal();
    //   await axios.delete(`http://localhost:8080/v1/assets/${id}`)
      
    // }
  
    const handleColumnSelect = (selector) => {
      if(selectedColumns.includes(selector)) {
        setSelectedColumns(selectedColumns.filter((col) => col !== selector));
      }
      else {
        setSelectedColumns([...selectedColumns,selector]);
      }
    };
  
  
   const columns = [
    {
      name: "ID",
      selector: 'id',
      sortable: true,
    },
    {
      name: "Name",
      selector: 'name',
      sortable: true,
    },
    {
      name: "Category",
      selector: 'category.name',
      sortable: true,
    },
    {
      name: "Manufacturer",
      selector: 'manufacturer.name',
      sortable: true,
    },
    {
      name: "Actions",
      selector: 'Actions',
      maxWidth: '500px',
      cell: (row) => (
        // <div>
        //   <Link className="btn btn-primary mx-1" to={`/editasset/${row.id}`}> Edit </Link>
        //   <Link className="btn btn-danger mx-1" onClick={() => deleteLicense(row.id)}> Delete </Link>
        // </div>
        <div>
        <Link title="Edit" className="btn btn-primary mx-1 editbtn" to={`/editasset/${row.id}`}>
          <RiEditLine /> {/* Edit icon */}
        </Link>
        <Link title="More" className="btn btn-secondary mx-1 readbtn" to={`/readasset/${row.id}`}>
          <RiBookReadFill/> {/* Read icon */}
        </Link>
      </div>
        
      ),
    },
  
   ];
  
   const visibleColumns = [...columns.filter((col) => selectedColumns.includes(col.selector))];
  
  
   useEffect(()=>{
    loadModels();
  },[]);
  
  useEffect(() => {
    const result = models.filter((asset) => {
      return visibleColumns.some((col) => {
        const value = models[col.selector];
        return String(value).toLowerCase().includes(search.toLowerCase());
      });
    });
    setFilteredModels(result);
    //console.log(result);
  }, [search, selectedColumns, models]);
  
  
//   const fetchDataToExport = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/v1/assets/export`, {
//         responseType: 'blob',
//       });
//       const fileName = 'assets.csv';
//       saveAs(response.data,fileName);
//     }
//     catch(error) {
//       console.log(error);
  
//     }
//   };
  
  
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
     <h3 className="listheading"><b>All Asset Models</b></h3>
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
          <Link className="btn btn-primary mx-2 add" to="/assetmodel">
            <b>Add Asset Model</b>
          </Link>
  
          {/* <Link className="btn btn-primary mx-2 import-btn" to="/uploader">
            <b>Import</b>
          </Link>
  
          <button className="btn btn-primary mx-2 export-btn" onClick={fetchDataToExport}>
      <b>Export</b>
    </button> */}
  
        </div>
  
        <DataTable 
        className="custom-datatable"
        columns={visibleColumns}
        data={filteredModels}
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
  
  {/* <Modal show={showModal} onHide={handleCloseModal} >
          <Modal.Header closeButton className="modal-style">
            <Modal.Title>Deletion Successful</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-style">
            <p>Your assetmodel has been successfully deleted.</p>
          </Modal.Body>
          <Modal.Footer className="modal-style">
            <Button variant="info" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal> */}
  
      </div>
    )
}
