import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/readpage.css";

export default function ReadAsset() {
  const [asset, setAsset] = useState({
    serialNumber: "",
    model: "",
    requireSupport: "",
    barcode: "",
    orderNumber: "",
    invoiceDate: "",
    depreciationRate: "",
    forceDepreciation: "",
    depreciationEndDate: "",
    buyoutDate: "",
    startUsage: "",
    provider: "",
    budgetInfo: "",
    invoiceNumber: "",
    currency: "",
    service: "",
    remarks: "",
  });

  const { id } = useParams();

  useEffect(() => {
    loadasset();
  }, []);

  const loadasset = async () => {
    const res = await axios.get(`http://localhost:8080/v1/assets/${id}`);
    setAsset(res.data);
    console.log(res.data);
  };

  return (
    <div className="read-container">
      <div className="page-top">
        {/* <Link className="btn btn-primary back-btn" to="/assetslist">
          back
        </Link> */}
        <h4 className="heading"><b>Asset Id: {id}</b></h4>
      </div>

      <div className="readlist">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Serial Number</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.serialNumber}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Barcode</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.barcode}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Budget Info</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.barcode}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Currency</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.currency}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Model</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.model.id}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Depreciation End Date</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.depreciationEndDate}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Force Depreciation</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.forceDepreciation}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Invoice Date</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.invoiceDate}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Invoice Number</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.invoiceNumber}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Order Number</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.orderNumber}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Provider</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.provider}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Service</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.service.id}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Require Support</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.requireSupport}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Start Usage</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.startUsage}</span>
            </div>
          </li>
          <li class="list-group-item">
            <div class="list-group-item-fixed">
              <strong class="list-group-left">Remarks</strong>
              <strong class="list-group-middle">:</strong>
              <span class="list-group-right">{asset.remarks}</span>
            </div>
          </li>
        </ul>
      </div>
      <Link className="btn btn-danger back-btn" to="/assetslist">
          back
        </Link>
    </div>
  );
}
