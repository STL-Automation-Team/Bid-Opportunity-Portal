import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Modal, Button } from "react-bootstrap";
import "../../styles/forms.css";
import FormFields2 from "../../components/FormFields2";

export default function AddLicense() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm();

  const navigate = useNavigate();

  const {Id} =useParams();

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/licenseslist");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const [license, setLicense] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [licenseTypes, setLicenseTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [budgetInfos, setbudgetInfos] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    fetchManufacturers();
    fetchSoftwares();
    fetchServices();
    fetchLicenseTypes();
    fetchBudgetInfos();
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


  const fetchSoftwares = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/settings/softwares"
      );
      setSoftwares(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/services"
      );
      setServices(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchLicenseTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/settings/licenseTypes"
      );
      setLicenseTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBudgetInfos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/v1/settings/budgetInfo"
      );
      setbudgetInfos(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const onSubmit = async (data) => {
    try {
      var selectedSoftware;

      softwares.map((software) => {
        console.log(software);
        if (data.software == software.id) {
          selectedSoftware = software;
        }
      });

      var selectedService;

      services.map((service) => {
        console.log(service);
        if (data.service == service.id) {
          selectedService = service;
        }
      });

      var selectedManufacturer;

      manufacturers.map((manufacturer) => {
        console.log(manufacturer);
        if (data.manufacturer == manufacturer.id) {
          selectedManufacturer = manufacturer;
        }
      });

      var selectedBudgetInfo;

      budgetInfos.map((budgetInfo) => {
        console.log(budgetInfo);
        if (data.budgetInfo == budgetInfo.id) {
          selectedBudgetInfo = budgetInfo;
        }
      });


      var selectedLicenseType;

      licenseTypes.map((licenseType) => {
        console.log(licenseType);
        if (data.licenseType == licenseType.id) {
          selectedLicenseType = licenseType;
        }
      });


      console.log(data);

      const req = {
        software: selectedSoftware,
        service: selectedService,
        manufacturer: selectedManufacturer,
        budgetInfo: selectedBudgetInfo,
        licenseType: selectedLicenseType,
        serialNumber: data.serialNumber,
        quantityUsed: data.quantityUsed,
        validThrough: data.validThrough,
        licenseDetails: data.licenseDetails,
        startUsageDate: data.startUsageDate,
        invoiceDate: data.invoiceDate,
        invoiceNumber: data.invoiceNumber,
        orderNumber: data.orderNumber,
        price: data.price,
        remarks: data.remarks,
        currency: data.currency,
        accountingId: data.accountingId,
        provider: data.provider,
        region: data.region,
        depreciationRate: data.depreciationRate,
        numberBought: data.numberBought,
      };

      const params = {
        manufacturerId: data.manufacturer,
        serviceId: data.service,
        softwareId: data.software,
        budgetInfoId: data.budgetInfo,
        licenseTypeId: data.licenseType, // Pass modelId as a request parameter
      };

      console.log(req);

      await axios.put(`http://localhost:8080/v1/licenses/${Id}`, req, {
        params,
      });
      handleShowModal();
    } catch (error) {
      console.error(error);
    }
  };

  const loadLicense = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/v1/licenses/${Id}`);
      console.log(response.data);
      setLicense(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadLicense();
  }, []);

  if (!license) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className="form-top">
    <h2 className="text-left m-1" style={{ color: "black" }}>
          <b>Edit License</b>
        </h2>
        <Link className="btn btn-danger btn-back mx-2 " to="/licenseslist">
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
            label="Serial Number" 
            name="serialNumber"
            type="required"
            defaultValue={license.serialNumber}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Valid Through"
            name="validThrough"
            type="date"
            defaultValue={
              license.validThrough
                ? new Date(license.validThrough)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Software" 
            name="software"
            type="select"
            defaultValue={license.software.id}
            register={register}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            options={softwares.map((software) => ({
              value: software.id,
              label: software.name,
            }))}
          />
          <FormFields2
            label="Manufacturer" 
            name="manufacturer"
            type="select"
            defaultValue={license.manufacturer.id}
            register={register}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            options={manufacturers.map((manufacturer) => ({
              value: manufacturer.id,
              label: manufacturer.name,
            }))}
          />
          <FormFields2
            label="License Details" 
            name="licenseDetails"
            defaultValue={license.licenseDetails}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="License Type" 
            name="licenseType"
            type="select"
            defaultValue={license.licenseType.id}
            register={register}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            options={licenseTypes.map((licenseType) => ({
              value: licenseType.id,
              label: licenseType.type,
            }))}
          />
          <FormFields2
            label="Region"
            name="region"
            defaultValue={license.region}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Service"
            name="service"
            type="select"
            defaultValue={license.service.id}
            register={register}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            options={services.map((service) => ({
              value: service.id,
              label: service.name,
            }))}
          />
          <FormFields2
            label="Remarks"
            name="remarks"
            defaultValue={license.remarks}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          </fieldset>


          <fieldset className="col form-part">
                <legend>Financial Info</legend>
          <FormFields2
            label="Invoice Date"  
            name="invoiceDate"
            type="date"
            defaultValue={
              license.invoiceDate
                ? new Date(license.invoiceDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Invoice Number"  
            name="invoiceNumber"
            defaultValue={license.invoiceNumber}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Order Number" 
            name="orderNumber"
            defaultValue={license.orderNumber}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Price" 
            name="price"
            type="decimal"
            defaultValue={license.price}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Currency" 
            name="currency"
            defaultValue={license.currency}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Accounting Id" 
            name="accountingId"
            defaultValue={license.accountingId}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Provider" 
            name="provider"
            defaultValue={license.provider}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Budget Info"
            name="budgetInfo"
            type="select"
            defaultValue={license.budgetInfo.id}
            register={register}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            options={budgetInfos.map((budgetInfo) => ({
              value: budgetInfo.id,
              label: budgetInfo.name,
            }))}
          />
          <FormFields2
            label="Start Usage Date" 
            name="startUsageDate"
            type="date"
            defaultValue={
              license.startUsageDate
                ? new Date(license.startUsageDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Depreciation Rate"
            name="depreciationRate"
            type="decimal_with_limit"
            defaultValue={license.depreciationRate}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Number Bought"
            name="numberBought"
            type="integer"
            defaultValue={license.numberBought}
            register={register}
            errors={errors}
            trigger={trigger}
          />
          <FormFields2
            label="Quantity Used" 
            name="quantityUsed"
            type="integer_with_0"
            defaultValue={license.quantityUsed}
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
          <p>Your license has been successfully edited.</p>
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