import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/readpage.css";
import ReadlistField from "../../components/ReadlistFields";

export default function ReadLicense() {
  const [license, setLicense] = useState({
        serialNumber: "",
        validThrough: "",
        software: "",
        manufacturer: "",
        licenseDetails: "",
        licenseType: "",
        region: "",
        service: "",
        remarks: "",
        invoiceDate: "",
        invoiceNumber: "",
        orderNumber: "",
        price: "",
        currency: "",
        accountingId: "",
        provider: "",
        budgetInfo: "",
        startUsageDate: "",
        depreciationRate: "",
        numberBought: "",
        quantityUsed: "",
  });

  const { id } = useParams();

  useEffect(() => {
    loadlicense();
  }, []);

  const loadlicense = async () => {
    const res = await axios.get(`http://localhost:8080/v1/licenses/${id}`);
    setLicense(res.data);
    console.log(res.data);
  };

  return (
    <div className="read-container">
      <div className="page-top">
        {/* <Link className="btn btn-primary back-btn" to="/licenseslist">
          back
        </Link> */}
        <h4 className="heading"><b>License Id: {id}</b></h4>
      </div>

      <div className="readlist">
        <ul class="list-group list-group-flush">
        <ReadlistField label="Serial Number" value={license.serialNumber} />
        <ReadlistField label="Valid Through" value={license.validThrough} />
        <ReadlistField label="Accounting ID" value={license.accountingId} />
        <ReadlistField label="Currency" value={license.currency} />
        <ReadlistField label="Budget Info" value={license.budgetInfo.id} />
        <ReadlistField label="Depreciation Rate" value={license.depreciationRate} />
        <ReadlistField label="Invoice Date" value={license.invoiceDate} />
        <ReadlistField label="Invoice Number" value={license.invoiceNumber} />
        <ReadlistField label="License Details" value={license.licenseDetails} />
        <ReadlistField label="License Type" value={license.licenseType.id} />
        <ReadlistField label="Manufacturer" value={license.manufacturer.id} />
        <ReadlistField label="Number Bought" value={license.numberBought} />
        <ReadlistField label="Order Number" value={license.orderNumber} />
        <ReadlistField label="Price" value={license.price} />
        <ReadlistField label="Provider" value={license.provider} />
        <ReadlistField label="Quantity Used" value={license.quantityUsed} />
        <ReadlistField label="Region" value={license.region} />
        <ReadlistField label="Remarks" value={license.remarks} />
        <ReadlistField label="Service" value={license.service.id} />
        <ReadlistField label="Software" value={license.software.id} />
        <ReadlistField label="Start Usage Date" value={license.startUsageDate} />

        </ul>
      </div>
      <Link className="btn btn-danger back-btn" to="/licenseslist">
          back
        </Link>
    </div>
  );
}
