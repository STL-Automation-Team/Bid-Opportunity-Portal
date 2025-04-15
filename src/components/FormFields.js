
import React from "react";

export default function FormFields({
  label,
  name,
  type = "text",
  register,
  errors,
  trigger,
  options = [],
}) {
    const shouldAddAsterisk = ["serial number", "software", "license type", "region"].includes(label.toLowerCase());


  const renderInputField = () => {
    switch (type) {
      case "select":
        return (
          <select
            className="form-control form-entry form-select"
            name={name}
            {...register(name, {
              required: `Please select ${label}`,
              validate: (value) => value !== "" || `Please select ${label}`,
            })}
            onChange={() => {
              trigger(name);
            }}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "date":
        return (
          <input
            type="date"
            className="form-control form-entry"
            name={name}
            {...register(name, {
              required: `${label} is required`,
            })}
            onKeyUp={() => {
              trigger(name);
            }}
          />
        );
      case "integer":
        return (
          <input
            type="number"
            className="form-control form-entry"
            name={name}
            {...register(name, {
              required: `${label} is required`,
            })}
            onKeyUp={() => {
              trigger(name);
            }}
          />
        );
      case "decimal":
        return (
          <input
            type="number"
            step="0.01"
            className="form-control form-entry"
            name={name}
            {...register(name, {
              required: `${label} is required`,
            })}
            onKeyUp={() => {
              trigger(name);
            }}
          />
        );
        case "checkbox":
        return (
          <input
            type="checkbox"
            className="form-check-input"
            name={name}
            {...register(name)}
            onChange={() => {
              trigger(name);
            }}
          />
        );
        
      default:
        return (
          <input
            type={type}
            className="form-control form-entry"
            name={name}
            {...register(name, {
              required: `${label} is required`,
            })}
            onKeyUp={() => {
              trigger(name);
            }}
          />
        );
    }
  };

  return (
    <div className="row mb-3">
      <label htmlFor={name} className="col-sm-2 col-form-label">
        {label}
        {shouldAddAsterisk && <span className="text-danger"> *</span>}
      </label>
      <div className="col-sm-10">
        {renderInputField()}
        {errors[name] && (
          <small className="text-danger d-block">{errors[name].message}</small>
        )}
      </div>
    </div>
  );
}
