import React from "react";

export default function FormFields({
  label,
  name,
  type = "text",
  register,
  errors,
  trigger,
  setValue,
  options = [],
  defaultValue,
  
}) {

  const isSelectField = type === "select";
  const isRequiredField = type === "required";
  

  const renderInputField = () => {

    switch (type) {
      case "select":
        return (
          <>
          <select
            className="form-control form-entry form-select "
            name={name}
            defaultValue={defaultValue}
            {...register(name, {
              validate: {
                emptyOption: (value) =>
                  value !== "" || `Please select ${label}`,
              },
            })}
            onChange={(e) => {
              setValue(name,e.target.value);
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
          {errors[name] && errors[name].type === "emptyOption" && (
        <small className="text-danger d-block">{errors[name].message}</small>
      )}
        </>
        );
      case "date":
        return (
          <input
            type="date"
            className="form-control form-entry"
            name={name}
            defaultValue={defaultValue}
            {...register(name)}
            onKeyUp={() => {
              trigger(name);
            }}
          />
        );
      case "integer_with_0":
        return (
          <>
          <input
            className="form-control form-entry"
            name={name}
            defaultValue={defaultValue}
            {...register(name, {
              pattern: {
                value: /^(\d+|0)$/,
                message:
                  "value should be integer including 0",
              },
            })}
            onKeyUp={() => {
              trigger(name);
            }}
          />
          {errors[name] && (
            <small className="text-danger d-block">{errors[name].message}</small>
          )}
          </>
        );
        case "integer":
          return (
            <>
            <input
              className="form-control form-entry"
              name={name}
              defaultValue={defaultValue}
              {...register(name, {
                pattern: {
                  value: /^[1-9]\d*$/,
                  message:
                    "value should be integer greaterthan or equal to 1",
                },
              })}
              onKeyUp={() => {
                trigger(name);
              }}
            />
            {errors[name] && (
            <small className="text-danger d-block">{errors[name].message}</small>
          )}
            </>
          );
      case "decimal_with_limit":
        return (
          <>
          <input
            step="0.01"
            className="form-control form-entry"
            name={name}
            defaultValue={defaultValue}
            {...register(name, {
              pattern: {
                value: /^(100(\.00)?|[0-9]{1,2}(\.[0-9]{1,2})?)$/,
                message:
                  "value range should be within 0.00 to 100.00",
                },
            })}
            onKeyUp={() => {
              trigger(name);
            }}
          />
          {errors[name] && (
            <small className="text-danger d-block">{errors[name].message}</small>
          )}
            </>
        );
        case "decimal":
        return (
          <>
          <input
            step="0.01"
            className="form-control form-entry"
            name={name}
            defaultValue={defaultValue}
            {...register(name, {
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message:
                  "value range should be in the form 0.00",
                },
            })}
            onKeyUp={() => {
              trigger(name);
            }}
          />
          {errors[name] && (
            <small className="text-danger d-block">{errors[name].message}</small>
          )}
            </>
        );
        case "required" :
          return (
            <>
            <input
              type={type}
              className="form-control form-entry"
              name={name}
              defaultValue={defaultValue}
              {...register(name, {
                required: `${label} is required`,
              })}
              onKeyUp={() => {
                trigger(name);
              }}
            />
            <small className="text-danger d-block">
          {errors[name]?.message || ''}
        </small>
            </>
          );

      case "checkbox":
        return (
          <input
            type="checkbox"
            className="form-check-input my-checkbox form-entry"
            name={name}
            defaultValue={defaultValue}
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
            defaultValue={defaultValue}
            {...register(name)}
            onKeyUp={() => {
              trigger(name);
            }}
          />
        );
    }
  };

  return (
    <div className="row mb-3">
      <label htmlFor={name} className="col-sm-3 col-form-label text-start" style={{ whiteSpace: "nowrap" }}>
        {label}
        {(isSelectField || isRequiredField) && (
          <span style={{ color: "red", margin: "3px" }}><b>*</b></span>
        )}
      </label>
      <div className="col-sm-8">
        {renderInputField()}
      </div>
    </div>
  );
}
