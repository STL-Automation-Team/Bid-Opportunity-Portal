import axios from "axios";
import React, { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Modal, Button } from "react-bootstrap";
import "../../styles/forms.css";
import FormFields2 from "../../components/FormFields2";

export default function AddOperation() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm();

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/operationslist");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const [operationStatuses, setOperationStatuses] = useState([]);
  const [operationTypes, setOperationTypes] = useState([]);
  const [reporters, setReporters] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchOperationStatuses();
    fetchOperationTypes();
    fetchReporters();
    fetchAssignees();
    fetchAssets();
  }, []);

  const fetchOperationStatuses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/settings/operations/operationStatuses"
      );
      setOperationStatuses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOperationTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/settings/operations/operationTypes"
      );
      setOperationTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReporters = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/users"
      );
      setReporters(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAssignees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/users"
      );
      setAssignees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/assets"
      );
      setAssets(response.data);
    } catch (error) {
      console.error(error);
    }
  };



  const onSubmit = async (data) => {
    try {
      // Submit form data

      console.log(data);

      const req = {
        statusId: data.operationStatus,
        typeId: data.operationType,
        name: data.name,
        description: data.description,
        reporterId: data.reporter,
        assigneeId: data.assignee,
        assetId: data.asset,
        ticketId: data.ticket,
      };

      console.log(req);

      await axios.post("http://localhost:8080/v1/operations", req);
      handleShowModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <div className="form-top">
    <h2 className="text-left m-1" style={{ color: "black" }}>
          <b>Add Operation</b>
        </h2>
        <Link className="btn btn-danger btn-back mx-2 " to="/operationslist">
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
            label="Name"
            name="name"
            type="required"
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Operation Status"
            name="operationStatus"
            type="select"
            register={register}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            options={operationStatuses.map((status) => ({
              value: status.id,
              label: status.name,
            }))}
          />
          <FormFields2
            label="Operation Type"
            name="operationType"
            type="select"
            register={register}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            options={operationTypes.map((type) => ({
              value: type.id,
              label: type.name,
            }))}
          />
          <FormFields2
            label="Reporter"
            name="reporter"
            type="select"
            register={register}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            options={reporters.map((reporter) => ({
              value: reporter.id,
              label: reporter.email,
            }))}
          />
          <FormFields2
            label="Assignee"
            name="assignee"
            type="select"
            register={register}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            options={assignees.map((assignee) => ({
              value: assignee.id,
              label: assignee.email,
            }))}
          />
          <FormFields2
            label="Ticket"
            name="ticket"
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Asset"
            name="asset"
            type="select"
            register={register}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            options={assets.map((asset) => ({
              value: asset.id,
              label: asset.serialNumber,
            }))}
          />
          <FormFields2
            label="Description"
            name="description"
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
          <p>Your operation has been successfully added.</p>
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