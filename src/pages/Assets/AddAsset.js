import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/forms.css";
import { useForm } from "react-hook-form";
import { Modal, Button } from "react-bootstrap";
import "../../styles/basic.css";

export default function AddAsset() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm();

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [service,setService] = useState({});
  const [model, setModel] = useState({});

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/assetslist");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const [models, setModels] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/settings/models"
      );
      console.log("Models : ", response.data);
      setModels(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/services"
      );
      console.log("Services : ", response.data);
      setServices(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      var selectedModel;

      models.map((model) => {
        console.log(model);
        if (data.model == model.id) {
          selectedModel = model;
        }
      });

      var selectedService;

      services.map((service) => {
        console.log(service);
        if (data.service == service.id) {
          selectedService = service;
        }
      });

      var customFieldValues = {};

      model.customFields.map((customField) => {
        customFieldValues[customField.id] = data[customField.name];
      });
      console.log("%%%", customFieldValues);
      const requestData = {
        serialNumber: data.serialNumber,
        model: selectedModel,
        requireSupport: data.requireSupport,
        barcode: data.barcode || "",
        orderNumber: data.orderNumber || "",
        invoiceDate: data.invoiceDate || "",
        depreciationRate: data.depreciationRate || "",
        forceDepreciation: data.forceDepreciation,
        depreciationEndDate: data.depreciationEndDate || "",
        buyoutDate: data.buyoutDate || "",
        startUsage: data.startUsage || "",
        provider: data.provider || "",
        budgetInfo: data.budgetInfo || "",
        invoiceNumber: data.invoiceNumber || "",
        currency: data.currency || "",
        service: selectedService,
        remarks: data.remarks || "",
        customFieldValues: customFieldValues,
      };

      const params = {
        modelId: data.model,
        serviceId: data.service, // Pass modelId as a request parameter
      };
      console.log(requestData);

      await axios.post("http://localhost:8080/v1/assets", requestData, {
        params,
      });
      console.log(requestData);
      handleShowModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="form-top">
        <h2 className="text-left m-1" style={{ color: "black" }}>
          <b>Add Asset</b>
        </h2>
        <Link className="btn btn-danger btn-back mx-2 " to="/assetslist">
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
          <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "1rem" }}>
            <div className="row">
              <fieldset className="col form-part">
                <legend>Basic Info</legend>

                <div className="row mb-3 ">
                  <label
                    htmlFor="Serial Number"
                    className="col-sm-3 col-form-label text-start"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Serial Number<span className="text-danger"> *</span>
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="text"
                      className="form-control form-entry"
                      name="serialNumber"
                      {...register("serialNumber", {
                        required: "Serial Number is required",
                      })}
                      onKeyUp={() => {
                        trigger("serialNumber");
                      }}
                    />
                    {errors.serialNumber && (
                      <small className="text-danger d-block">
                        {errors.serialNumber.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="row mb-3 ">
                  <label
                    htmlFor="Require Support"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Require Support
                  </label>
                  <div
                    className="col-sm-8 form-check "
                    style={{ marginLeft: "1rem" }}
                  >
                    {/* <div className="form-check"> */}
                    <input
                      type="checkbox"
                      className="form-check-input my-checkbox form-entry"
                      name="requireSupport"
                      {...register("requireSupport")}
                    />
                    {/* </div> */}
                  </div>
                </div>

                <div className="row mb-3">
                  <label
                    htmlFor="Barcode"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Barcode
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="text"
                      className="form-control form-entry"
                      name="barcode"
                      {...register("barcode")}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label
                    htmlFor="Model"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Model<span className="text-danger"> *</span>
                  </label>
                  <div className="col-sm-8 ">
                    <select
                      className="form-control form-entry form-select"
                      name="model"
                      {...register("model", {
                        required: "Model is required",
                        validate: (value) =>
                          value !== "" || "Please select model",
                      })}
                      onChange={(e) => {
                        setSelectedModel(e.target.value);
                        models.map((mode) => {
                          if (mode.id == e.target.value) {
                            console.log("###", mode);
                            setModel(mode);
                          }
                        });
                        setValue("model",e.target.value);
                        trigger("model");
                      }}
                      onKeyUp={() => {
                        trigger("model");
                      }}
                    >
                      <option value="">Select model</option>
                      {models.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>

                    {errors.model && (
                      <small className="text-danger d-block">
                        {errors.model.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <label
                    htmlFor="Remarks"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Remarks
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="text"
                      className="form-control form-entry"
                      name="remarks"
                      {...register("remarks")}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="col form-part">
                <legend>Financial Info</legend>
                <div className="row mb-3">
                  <label
                    htmlFor="Order Number"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Order Number
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="text"
                      className="form-control form-entry"
                      name="orderNumber"
                      {...register("orderNumber")}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="Provider"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Provider
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="text"
                      className="form-control form-entry"
                      name="provider"
                      {...register("provider")}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="Budget Info"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Budget Info
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="text"
                      className="form-control form-entry"
                      name="budgetInfo"
                      {...register("budgetInfo")}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label
                    htmlFor="Invoice Date"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Invoice Date
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="date"
                      className="form-control form-entry"
                      name="invoiceDate"
                      {...register("invoiceDate")}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="Invoice Number"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Invoice Number
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="text"
                      className="form-control form-entry"
                      name="invoiceNumber"
                      {...register("invoiceNumber")}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="Depreciation Rate"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Depreciation Rate
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="text"
                      className="form-control form-entry"
                      name="depreciationRate"
                      {...register("depreciationRate", {
                        pattern: {
                          value: /^(100(\.00)?|[0-9]{1,2}(\.[0-9]{1,2})?)$/,
                          message:
                            "value range should be within 0.00 to 100.00",
                        },
                      })}
                      onKeyUp={() => {
                        trigger("depreciationRate");
                      }}
                    />
                    {errors.depreciationRate && (
                      <small className="text-danger d-block">
                        {errors.depreciationRate.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="Force Depreciation"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Force Depreciation
                  </label>
                  <div
                    className="col-sm-8 form-check"
                    style={{ marginLeft: "1rem" }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input my-checkbox form-entry"
                      name="forceDepreciation"
                      {...register("forceDepreciation")}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label
                    htmlFor="Depreciation End Date"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Depreciation End Date
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="date"
                      className="form-control form-entry"
                      name="depreciationEndDate"
                      {...register("depreciationEndDate")}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="Buyout Date"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Buyout Date
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="date"
                      className="form-control form-entry"
                      name="buyoutDate"
                      {...register("buyoutDate")}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label
                    htmlFor="Currency"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Currency
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="text"
                      className="form-control form-entry"
                      name="currency"
                      {...register("currency")}
                      onKeyUp={() => {
                        trigger("currency");
                      }}
                    />
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="row">
              <fieldset className="col form-part">
                <legend>Usage Info</legend>
                <div className="row mb-3">
                  <label
                    htmlFor="Start Usage"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Start Usage
                  </label>
                  <div className="col-sm-8 ">
                    <input
                      type="date"
                      className="form-control form-entry"
                      name="startUsage"
                      {...register("startUsage")}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label
                    htmlFor="Service"
                    className="col-sm-3 col-form-label text-start"
                  >
                    Service
                  </label>
                  <div className="col-sm-8 ">
                    <select
                      className="form-control form-entry form-select"
                      name="service"
                      {...register("service")}
                      onChange={(e) => {
                        setSelectedService(e.target.value);
                        services.map((serv) => {
                          if (serv.id == e.target.value) {
                            console.log("###", serv);
                            setService(serv);
                          }
                        });
                      }}
                      onKeyUp={() => {
                        trigger("service");
                      }}
                    >
                      <option value="">Select service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              <fieldset className="col form-part">
                <legend>Custom Fields</legend>
                {models.map((model) => {
                  if (model.id == selectedModel) {
                    return model.customFields.map((customField) => (
                      <div className="row mb-3">
                        <label
                          htmlFor="Budget Info"
                          className="col-sm-3 col-form-label text-start"
                        >
                          {customField.name}
                        </label>
                        <div className="col-sm-8 ">
                          <input
                            type="text"
                            className="form-control form-entry"
                            name={customField.name}
                            {...register(customField.name)}
                          />
                        </div>
                      </div>
                    ));
                  }
                })}
              </fieldset>
            </div>
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
            <p>Your asset has been successfully added.</p>
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
