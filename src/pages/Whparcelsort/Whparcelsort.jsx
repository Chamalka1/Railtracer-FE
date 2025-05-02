import React, { useState } from 'react';
import './Whparcelsort.css';
import axios from 'axios';

const statusOptions = ['Pending', 'Dispatched', 'In Transit'];
const sizeOptions = ['S', 'M', 'L'];
const priorityOptions = ['Low', 'Medium', 'High'];

const Whparcelsort = () => {
  const [parcels, setParcels] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [inputParcelId, setInputParcelId] = useState('');

  const fetchParcelDetails = async () => {
    try {
      const response = await axios.get(`/api/parcel/${inputParcelId}`);
      const parcel = response.data;

      const newParcel = {
        id: Date.now(),
        parcelId: parcel.parcelId,
        description: parcel.description,
        to: parcel.to,
        from: parcel.from,
        warehouseName: '',
        stationName: '',
        arrivedTime: '',
        dispatchedTime: '',
        status: 'Pending',
        size: 'Small',
        priority: '',
        damagedStatus: '',
        isEditing: true,
      };

      setParcels([...parcels, newParcel]);
    } catch (error) {
      console.error('Failed to fetch parcel:', error);
      alert('Parcel not found or error fetching details');
    }
  };

  const handleChange = (index, field, value) => {
    const updatedParcels = [...parcels];
    updatedParcels[index][field] = value;
    setParcels(updatedParcels);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sorted = [...parcels].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setParcels(sorted);
    setSortConfig({ key, direction });
  };

  const handleSave = (index) => {
    const updatedParcels = [...parcels];
    updatedParcels[index].isEditing = false;
    setParcels(updatedParcels);
    // axios.post('/api/sortpackage', updatedParcels[index])
  };

  const handleEdit = (index) => {
    const updatedParcels = [...parcels];
    updatedParcels[index].isEditing = true;
    setParcels(updatedParcels);
  };

  const handleDelete = (index) => {
    const updatedParcels = [...parcels];
    updatedParcels.splice(index, 1);
    setParcels(updatedParcels);
  };

  return (
    
    <div className="container mt-4">
      
      <h4 className="mb-3">Warehouse Parcel Log</h4>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Parcel ID"
          value={inputParcelId}
          onChange={(e) => setInputParcelId(e.target.value)}
        />
        <button className="btn btn-success" onClick={fetchParcelDetails}>
          Fetch Details
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Parcel ID</th>
            <th>Description</th>
            <th>To</th>
            <th>From</th>
            {['warehouseName', 'stationName', 'arrivedTime', 'dispatchedTime', 'priority'].map((col) => (
              <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                {col.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </th>
            ))}
            <th>Status</th>
            <th>Size</th>
            <th>Damaged</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel.id}>
              <td>{parcel.parcelId}</td>
              <td>{parcel.description}</td>
              <td>{parcel.to}</td>
              <td>{parcel.from}</td>
              <td>
                {parcel.isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={parcel.warehouseName}
                    onChange={(e) => handleChange(index, 'warehouseName', e.target.value)}
                  />
                ) : parcel.warehouseName}
              </td>
              <td>
                {parcel.isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={parcel.stationName}
                    onChange={(e) => handleChange(index, 'stationName', e.target.value)}
                  />
                ) : parcel.stationName}
              </td>
              <td>
                {parcel.isEditing ? (
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={parcel.arrivedTime}
                    onChange={(e) => handleChange(index, 'arrivedTime', e.target.value)}
                  />
                ) : parcel.arrivedTime}
              </td>
              <td>
                {parcel.isEditing ? (
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={parcel.dispatchedTime}
                    onChange={(e) => handleChange(index, 'dispatchedTime', e.target.value)}
                  />
                ) : parcel.dispatchedTime}
              </td>
              <td>
                {parcel.isEditing ? (
                  <select
                    className="form-select"
                    value={parcel.priority}
                    onChange={(e) => handleChange(index, 'priority', e.target.value)}
                  >
                    {priorityOptions.map(status => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                ) : parcel.priority}
              </td>
              <td>
                {parcel.isEditing ? (
                  <select
                    className="form-select"
                    value={parcel.status}
                    onChange={(e) => handleChange(index, 'status', e.target.value)}
                  >
                    {statusOptions.map(status => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                ) : parcel.status}
              </td>
              <td>
                {parcel.isEditing ? (
                  <select
                    className="form-select"
                    value={parcel.size}
                    onChange={(e) => handleChange(index, 'size', e.target.value)}
                  >
                    {sizeOptions.map(size => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                ) : parcel.size}
              </td>
              <td>
                {parcel.isEditing ? (
                  <div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`damaged-${index}`}
                        checked={parcel.damagedStatus === 'Yes'}
                        onChange={() => handleChange(index, 'damagedStatus', 'Yes')}
                      />
                      <label className="form-check-label">Yes</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`damaged-${index}`}
                        checked={parcel.damagedStatus === 'No'}
                        onChange={() => handleChange(index, 'damagedStatus', 'No')}
                      />
                      <label className="form-check-label">No</label>
                    </div>
                  </div>
                ) : parcel.damagedStatus}
              </td>
              <td>
                {parcel.isEditing ? (
                  <button className="btn btn-sm btn-primary me-1" onClick={() => handleSave(index)}>Save</button>
                ) : (
                  <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(index)}>Edit</button>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Whparcelsort;
