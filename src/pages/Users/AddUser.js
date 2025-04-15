import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Modal, Button } from "react-bootstrap";
import "../../styles/forms.css";
import FormFields2 from "../../components/FormFields2";

export default function AddUser() {
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
    navigate("/userslist");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      // Submit form data
      await axios.post("http://localhost:8080/v1/users", data);
      handleShowModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <div className="form-top">
    <h2 className="text-left m-1" style={{ color: "black" }}>
          <b>Add User</b>
        </h2>
        <Link className="btn btn-danger btn-back mx-2 " to="/userslist">
          Back
        </Link>
    </div>
    <div style={{ width: "100%", padding: "1rem 2rem" }}>
      <div
        className="col-md-9 border rounded shadow"
        style={{
          backgroundColor: "gainsboro",
          width: "100%",
          padding: "1rem",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ padding: "1rem" }}
        >
            <div className="row">
              <fieldset className="col form-part">
                <legend>Basic Info</legend>

          <FormFields2
            label="First Name"
            name="firstName"
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Last Name"
            name="lastName"
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Email"
            name="email"
            register={register}
            errors={errors}
            trigger={trigger}
          />
</fieldset>
            </div>

          {/* Add more form fields here using FormFields component */}

          <div className="row">
              <div className="col">
                <button type="submit" className="btn btn-success submit-btn">
                  <b>Submit</b>
                </button>
              </div>
            </div>
        </form>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="modal-style">
          <Modal.Title>Submission Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-style">
          <p>Your user has been successfully added.</p>
        </Modal.Body>
        <Modal.Footer className="modal-style">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
}