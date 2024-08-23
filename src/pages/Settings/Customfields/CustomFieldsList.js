import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL as API_BASE_URL } from '../../../components/constants';
import './style.css';


const modules = [
  {
    name: 'Department',
    endpoint: '/api/department',
    fields: [
      { name: 'dep_name', label: 'Department Name', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true }
    ],
  },
  {
    name: 'Business Unit',
    endpoint: '/api/business-units',
    fields: [
      { name: 'businessUnit', label: 'Business Unit', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true }
    ],
  },
  {
    name: 'Industry Segment',
    endpoint: '/api/business-segments',
    fields: [
      { name: 'name', label: 'Segment Name', type: 'text', required: true }
    ],
  },
  {
    name: 'Financial Year',
    endpoint: '/api/fy',
    fields: [
      { name: 'obFy', label: 'FY', type: 'number', required: true },
    
    ],
  },
  {
    name: 'Priority',
    endpoint: '/api/priority',
    fields: [
      { name: 'priority', label: 'Priority', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true }
    ],
  },
  {
    name: 'Deal Status',
    endpoint: '/api/deals',
    fields: [
      { name: 'dealStatus', label: 'Deal Status', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true }
    ],
  },
  {
    name: 'Go-No-Go Status',
    endpoint: '/api/go-no-go',
    fields: [
      { name: 'dealStatus', label: 'Go-No-Go value', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true }
    ],
  },
];

const DataForm = ({ module, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    module.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="data-form">
      {module.fields.map((field) => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>{field.label}</label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className={errors[field.name] ? 'error' : ''}
            >
              <option value="">Select {field.label}</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className={errors[field.name] ? 'error' : ''}
            />
          )}
          {errors[field.name] && <span className="error-message">{errors[field.name]}</span>}
        </div>
      ))}
      <button type="submit" className="submit-btn">{initialData ? 'Update' : 'Create'}</button>
    </form>
  );
};


const DataTable = ({ data, module, onEdit, onDelete }) => (
  <div className="table-container">
    {data.length > 0 ? (
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            {module.fields.map((field) => (
              <th key={field.name}>{field.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              {module.fields.map((field) => (
                <td key={field.name}>{item[field.name]}</td>
              ))}
              <td>
                <button onClick={() => onEdit(item)} className="edit-btn">Edit</button>
                <button onClick={() => onDelete(item.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="no-data">No data available</p>
    )}
  </div>
);

export default function CustomFieldsList() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (selectedModule) {
      fetchData();
    }
  }, [selectedModule]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${selectedModule.endpoint}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data.');

    }
  };

  const handleCreate = async (formData) => {
    try {
      const createdAt = new Date().toISOString();
      const createdBy = 'Admin'; // You can replace this with the actual username if available

      const response = await axios.post(`${API_BASE_URL}${selectedModule.endpoint}`, {
        ...formData,
        createdAt,
        createdBy,
      });
      fetchData();
      setData([]);
      alert('Item created successfully!');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Error creating item.');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const updatedAt = new Date().toISOString();
      const updatedBy = 'Admin'; // You can replace this with the actual username if available

      await axios.put(`${API_BASE_URL}${selectedModule.endpoint}/${formData.id}`, {
        ...formData,
        updatedBy,
        updatedAt,
      });
      fetchData();
      setEditingItem(null);
      setData([]);
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}${selectedModule.endpoint}/${id}`);
      fetchData();
      setData([]);
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item.');
    }
  };

  const handleModuleChange = (module) => {
    setSelectedModule(module);
    setEditingItem(null);
    setData([]);
  };

  return (
    <div className="datatable-container">
      <h3 className="listheading"><b>Data Management Module</b></h3>
      <div className="data-management-layout">
        <div className="modules-sidebar">
          {modules.map((module) => (
            <button
              key={module.name}
              onClick={() => handleModuleChange(module)}
              className={selectedModule === module ? 'active' : ''}
            >
              {module.name}
            </button>
          ))}
        </div>
        <div className="module-content">
          {selectedModule ? (
            <>
              <h4>{selectedModule.name}</h4>
              <DataForm
                module={selectedModule}
                onSubmit={editingItem ? handleUpdate : handleCreate}
                initialData={editingItem}
              />
              <DataTable
                data={data}
                module={selectedModule}
                onEdit={setEditingItem}
                onDelete={handleDelete}
              />
            </>
          ) : (
            <p className="select-module">Please select a module from the list on the left.</p>
          )}
        </div>
      </div>
    </div>
  );
}