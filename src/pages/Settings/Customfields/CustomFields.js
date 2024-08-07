import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Modal, Button } from "react-bootstrap";
import "../../../styles/forms.css";
import FormFields from "../../../components/FormFields";

export default function AddCustomFields() {
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
    navigate("/customfieldslist");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      // Submit form data
      await axios.post("http://localhost:8080/v1/settings/custom-fields", data);
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
          Add Custom Field
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
            label="Validation"
            name="validation"
            register={register}
            errors={errors}
            trigger={trigger}
          />
          {/* Add more form fields here using FormFields component */}

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <Link  className="btn btn-danger" to="/customfieldslist" style={{margin:"0rem 1rem"}}>
            back
          </Link>
        </form>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="modal-style">
          <Modal.Title>Submission Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-style">
          <p>Your custom field has been successfully added.</p>
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
