import React, { useState, useEffect } from "react";
import axios from "axios";
import ErrorDisplay from "./ErrorDisplay";

const UserManagement = () => {
  const API_BASE_URL = "http://localhost:5000/api/v1";
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    contactNumber: "",
    employeeId: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      const url = editingUser
        ? `${API_BASE_URL}/users/${editingUser._id}`
        : `http://localhost:5000/api/auth/users`;
      const method = editingUser ? "put" : "post";

      const response = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reset form and refresh user list
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        contactNumber: "",
        employeeId: "",
        department: "",
      });
      setEditingUser(null);
      setShowModal(false);
      fetchUsers();

      // Show success message
      if (!editingUser) {
        alert(
          "User created successfully. An email has been sent to the user with password setup instructions."
        );
      } else {
        alert("User updated successfully.");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response?.data) {
      const { message, errors: validationErrors } = error.response.data;
      if (validationErrors) {
        setErrors(validationErrors);
      } else if (message) {
        setErrors({ general: message });
      }
    } else {
      setErrors({ general: "An unexpected error occurred" });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "",
      contactNumber: user.contactNumber || "",
      employeeId: user.employeeId || "",
      department: user.department || "",
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>User Management</h4>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingUser(null);
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              role: "",
              contactNumber: "",
              employeeId: "",
              department: "",
            });
            setErrors({});
            setShowModal(true);
          }}
        >
          Add New User
        </button>
      </div>

      {/* Error Display */}
      <ErrorDisplay errors={errors} />

      {/* User Modal */}
      {showModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? "Edit User" : "Add New User"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.firstName ? "is-invalid" : ""
                      }`}
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.lastName ? "is-invalid" : ""
                      }`}
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                    {!editingUser && (
                      <div className="form-text">
                        An email will be sent to this address with password
                        setup instructions.
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className={`form-select ${
                        errors.role ? "is-invalid" : ""
                      }`}
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="customerSupport">Customer Support</option>
                      <option value="logisticOperator">
                        Logistic Operator
                      </option>
                    </select>
                    {errors.role && (
                      <div className="invalid-feedback">{errors.role}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className={`form-control ${
                        errors.contactNumber ? "is-invalid" : ""
                      }`}
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.contactNumber && (
                      <div className="invalid-feedback">
                        {errors.contactNumber}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.employeeId ? "is-invalid" : ""
                      }`}
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                    />
                    {errors.employeeId && (
                      <div className="invalid-feedback">
                        {errors.employeeId}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.department ? "is-invalid" : ""
                      }`}
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                    {errors.department && (
                      <div className="invalid-feedback">
                        {errors.department}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge bg-primary">{user.role}</span>
                </td>
                <td>{user.employeeId}</td>
                <td>{user.department}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
