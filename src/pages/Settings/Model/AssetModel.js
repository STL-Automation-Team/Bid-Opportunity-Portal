import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Modal, Button } from "react-bootstrap";
import "../../../styles/forms.css";
import FormFields from "../../../components/FormFields";
import { Dropdown } from "react-bootstrap";

export default function AssetModel() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/modellist");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customfields, setCustomfields] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    fetchManufacturers();
    fetchCategories();
    fetchCustomfields();
  }, []);

  const fetchManufacturers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/settings/models/manufacturers"
      );
      setManufacturers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/settings/models/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCustomfields = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/settings/custom-fields"
      );
      setCustomfields(response.data);
      console.log(customfields);
    } catch (error) {
      console.error(error);
    }
  };

  const handleColumnSelect = (selector) => {
    if (selectedColumns.includes(selector)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== selector));
    } else {
      setSelectedColumns([...selectedColumns, selector]);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Submit form data
      console.log(data);

      const req = {
        categoryId: data.category,
        manufacturerId: data.manufacturer,
        name: data.name,
        type: data.type,
        customFieldIds: selectedColumns,
      };

      console.log(req);
      setSubmittedData(req);

      await axios
        .post("http://localhost:8080/v1/settings/models", req)
        .then((res) => {
          console.log(res);
        });
      handleShowModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="row justify-content-center">
      <div
        className="col-md-9 border rounded p-4 mt-2 shadow"
        style={{ backgroundColor: "white", width: "80%" }}
      >
        <h2 className="text-center m-4" style={{ color: "navy" }}>
          Add Asset Model
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: "80%", marginLeft: "7rem", fontWeight: "500" }}
        >
          <FormFields
            label="Name"
            name="name"
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields
            label="Type"
            name="type"
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields
            label="Manufacturer"
            name="manufacturer"
            type="select"
            register={register}
            errors={errors}
            trigger={trigger}
            options={manufacturers.map((manufacturer) => ({
              value: manufacturer.id,
              label: manufacturer.name,
            }))}
          />
          <FormFields
            label="Category"
            name="category"
            type="select"
            register={register}
            errors={errors}
            trigger={trigger}
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          />
          <div style={{ display: "flex" }}>
            <div style={{padding:"0px 18px"}}>
              Select Custom Fields
            </div>
            <div >
            <Dropdown>
              <Dropdown.Toggle
                variant="primary"
                className="mx-2 columnselector"
              >
                {selectedColumns.map((col) => {
                  return customfields.map((customfield) => {
                    if (customfield.id === col) {
                      return customfield.name + ", ";
                    }
                  });
                })}
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-scrollable">
                <div className="dropdown-column-wrapper">
                  {customfields.map((col) => (
                    <div key={col.id} className="dropdown-item">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={col.id}
                        checked={selectedColumns.includes(col.id)}
                        onChange={() => handleColumnSelect(col.id)}
                      />
                      <label className="form-check-label" htmlFor={col.id}>
                        {col.name}
                      </label>
                    </div>
                  ))}
                </div>
              </Dropdown.Menu>
            </Dropdown>
            </div>
          </div>
          {/* <div>
            {selectedColumns.map((col) => {
              return customfields.map((customfield) => {
                if (customfield.id === col) {
                  return customfield.name;
                }
              });
            })}
          </div> */}

          {/* Add more form fields here using FormFields component */}

          <button type="submit" className="btn btn-success" style={{margin:"0rem 1rem"}}>
            Submit
          </button>
          <Link  className="btn btn-danger" to="/modellist" style={{margin:"0rem 1rem"}}>
            back
          </Link>
        </form>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="modal-style">
          <Modal.Title>Submission Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-style">
          <p>Your model has been successfully added.</p>
        </Modal.Body>
        <Modal.Footer className="modal-style">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
