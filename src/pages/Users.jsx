
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Users as UsersIcon,
  CheckSquare,
  Square,
  Trash,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../store/slices/userSlice";

import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";
import FormField from "../components/common/FormField";
import ErrorState from "../components/common/ErrorState";
import { useToast } from "../components/common/ToastContext";

const Users = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { users, loading, error } = useSelector(
    (state) => state.users
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const [formErrors, setFormErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Employee",
    status: "Active",
  });

  const itemsPerPage = 8;

  // ----------------------------------
  // Fetch Users
  // ----------------------------------

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // ----------------------------------
  // Reset Page On Search
  // ----------------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ----------------------------------
  // Clear Selection On Page Change
  // ----------------------------------

  useEffect(() => {
    setSelectedUsers([]);
  }, [currentPage]);

  // ----------------------------------
  // Search
  // ----------------------------------

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users || [];
    }

    return (users || []).filter((user) => {
      return [
        user.name,
        user.email,
        user.role,
        user.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );
    });
  }, [users, search]);

  // ----------------------------------
  // Sorting
  // ----------------------------------

  const sortedUsers = useMemo(() => {
    const result = [...filteredUsers];

    result.sort((a, b) => {
      const first = String(
        a?.[sortConfig.key] ?? ""
      ).toLowerCase();

      const second = String(
        b?.[sortConfig.key] ?? ""
      ).toLowerCase();

      if (first < second) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }

      if (first > second) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      return 0;
    });

    return result;
  }, [filteredUsers, sortConfig]);

  // ----------------------------------
  // Pagination
  // ----------------------------------

  const totalPages = Math.ceil(
    sortedUsers.length / itemsPerPage
  );

  const safePage =
    totalPages > 0 && currentPage > totalPages
      ? totalPages
      : currentPage;

  const startIndex =
    (safePage - 1) * itemsPerPage;

  const paginatedUsers = sortedUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ----------------------------------
  // Selection
  // ----------------------------------

  const pageUserIds = paginatedUsers.map((user) =>
    String(user.id)
  );

  const allPageSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((user) =>
      selectedUsers.includes(String(user.id))
    );

  const toggleUserSelection = (id) => {
    const stringId = String(id);

    setSelectedUsers((prev) =>
      prev.includes(stringId)
        ? prev.filter((userId) => userId !== stringId)
        : [...prev, stringId]
    );
  };

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedUsers((prev) =>
        prev.filter(
          (id) => !pageUserIds.includes(id)
        )
      );
    } else {
      setSelectedUsers((prev) => [
        ...new Set([...prev, ...pageUserIds]),
      ]);
    }
  };

  // ----------------------------------
  // Sorting Handler
  // ----------------------------------

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key &&
        prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={14} />;
    }

    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  // ----------------------------------
  // Form
  // ----------------------------------

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      role: "Employee",
      status: "Active",
    });

    setFormErrors({});
  };

  const openCreateModal = () => {
    setEditingUser(null);
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "Employee",
      status: user.status || "Active",
    });

    setFormErrors({});
    setModalOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ----------------------------------
  // Form Validation
  // ----------------------------------

  const validateForm = () => {
    const errors = {};

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      errors.name = "Name is required.";
    } else if (name.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.email = "Enter a valid email address.";
    }

    if (!form.role) {
      errors.role = "Role is required.";
    }

    if (!form.status) {
      errors.status = "Status is required.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // ----------------------------------
  // Create / Update
  // ----------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    };

    try {
      if (editingUser) {
        await dispatch(
          updateUser({
            id: editingUser.id,
            userData,
          })
        ).unwrap();

        showToast("User updated successfully");
      } else {
        await dispatch(
          createUser(userData)
        ).unwrap();

        showToast("User created successfully");
      }

      setModalOpen(false);
      setEditingUser(null);
      resetForm();
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Something went wrong",
        "error"
      );
    }
  };

  // ----------------------------------
  // Delete
  // ----------------------------------

  const openDeleteModal = (user) => {
    setDeletingUser(user);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;

    try {
      await dispatch(
        deleteUser(deletingUser.id)
      ).unwrap();

      setSelectedUsers((prev) =>
        prev.filter(
          (id) =>
            id !== String(deletingUser.id)
        )
      );

      showToast("User deleted successfully");
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to delete user",
        "error"
      );
    } finally {
      setDeleteModal(false);
      setDeletingUser(null);
    }
  };

  // ----------------------------------
  // Bulk Delete
  // ----------------------------------

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      return;
    }

    try {
      for (const id of selectedUsers) {
        await dispatch(deleteUser(id)).unwrap();
      }

      showToast(
        `${selectedUsers.length} users deleted successfully`
      );

      setSelectedUsers([]);
      setBulkDeleteModal(false);
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to delete selected users",
        "error"
      );
    }
  };

  // ----------------------------------
  // Status
  // ----------------------------------

  const getStatusClass = (status) => {
    return String(status).toLowerCase() === "active"
      ? "status-badge active"
      : "status-badge inactive";
  };

  // ----------------------------------
  // UI
  // ----------------------------------

  return (
    <div className="page-container">

      {/* Page Header */}

      <div className="page-header">
        <div>
          <h1>Users</h1>

          <p>
            Manage users and access permissions.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          <Plus size={17} />
          Add User
        </button>
      </div>

      {/* Users Card */}

      <div className="dashboard-card users-card">

        {/* Toolbar */}

        <div className="table-toolbar">

          <div className="table-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="table-summary">
            {filteredUsers.length} users
          </div>

        </div>

        {/* Bulk Toolbar */}

        {selectedUsers.length > 0 && (
          <div className="bulk-toolbar">

            <div className="bulk-selected">
              <CheckSquare size={17} />

              <strong>
                {selectedUsers.length}
              </strong>

              <span>selected</span>
            </div>

            <button
              type="button"
              className="bulk-delete-btn"
              onClick={() =>
                setBulkDeleteModal(true)
              }
            >
              <Trash size={15} />
              Delete Selected
            </button>

          </div>
        )}

        {/* Loading */}

        {loading ? (
          <div className="table-loading">
            Loading users...
          </div>

        ) : error ? (

          /* Error */

          <ErrorState
            message={error}
            onRetry={() =>
              dispatch(fetchUsers())
            }
          />

        ) : paginatedUsers.length === 0 ? (

          /* Empty */

          <div className="table-empty">

            <UsersIcon size={34} />

            <h3>No users found</h3>

            <p>
              Try changing your search or add
              a new user.
            </p>

          </div>

        ) : (

          /* Table */

          <>
            <div className="table-responsive">

              <table className="data-table">

                <thead>

                  <tr>

                    {/* Select All */}

                    <th className="checkbox-column">

                      <button
                        type="button"
                        className="table-checkbox"
                        onClick={toggleSelectAll}
                        aria-label="Select all users"
                      >
                        {allPageSelected ? (
                          <CheckSquare size={17} />
                        ) : (
                          <Square size={17} />
                        )}
                      </button>

                    </th>

                    {/* User */}

                    <th>

                      <button
                        type="button"
                        className="sort-button"
                        onClick={() =>
                          handleSort("name")
                        }
                      >
                        User
                        {getSortIcon("name")}
                      </button>

                    </th>

                    {/* Email */}

                    <th>

                      <button
                        type="button"
                        className="sort-button"
                        onClick={() =>
                          handleSort("email")
                        }
                      >
                        Email
                        {getSortIcon("email")}
                      </button>

                    </th>

                    {/* Role */}

                    <th>

                      <button
                        type="button"
                        className="sort-button"
                        onClick={() =>
                          handleSort("role")
                        }
                      >
                        Role
                        {getSortIcon("role")}
                      </button>

                    </th>

                    {/* Status */}

                    <th>

                      <button
                        type="button"
                        className="sort-button"
                        onClick={() =>
                          handleSort("status")
                        }
                      >
                        Status
                        {getSortIcon("status")}
                      </button>

                    </th>

                    {/* Actions */}

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {paginatedUsers.map((user) => {

                    const userId = String(user.id);

                    const isSelected =
                      selectedUsers.includes(userId);

                    const initials =
                      (user.name || "U")
                        .trim()
                        .charAt(0)
                        .toUpperCase();

                    return (
                      <tr
                        key={user.id}
                        className={
                          isSelected
                            ? "selected-row"
                            : ""
                        }
                      >

                        {/* Checkbox */}

                        <td>

                          <button
                            type="button"
                            className="table-checkbox"
                            onClick={() =>
                              toggleUserSelection(
                                user.id
                              )
                            }
                            aria-label={`Select ${
                              user.name || "user"
                            }`}
                          >
                            {isSelected ? (
                              <CheckSquare
                                size={17}
                              />
                            ) : (
                              <Square size={17} />
                            )}
                          </button>

                        </td>

                        {/* User */}

                        <td>

                          <div className="user-cell">

                            <div className="table-avatar">
                              {initials}
                            </div>

                            <div>

                              <strong>
                                {user.name ||
                                  "Unnamed User"}
                              </strong>

                              <span>
                                ID: #{user.id}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* Email */}

                        <td>
                          {user.email || "—"}
                        </td>

                        {/* Role */}

                        <td>
                          {user.role || "Employee"}
                        </td>

                        {/* Status */}

                        <td>

                          <span
                            className={getStatusClass(
                              user.status
                            )}
                          >
                            <span className="status-dot" />

                            {user.status ||
                              "Inactive"}
                          </span>

                        </td>

                        {/* Actions */}

                        <td>

                          <div className="table-actions">

                            <button
                              type="button"
                              className="icon-action edit"
                              onClick={() =>
                                openEditModal(user)
                              }
                              title="Edit"
                              aria-label="Edit user"
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              type="button"
                              className="icon-action delete"
                              onClick={() =>
                                openDeleteModal(user)
                              }
                              title="Delete"
                              aria-label="Delete user"
                            >
                              <Trash2 size={15} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

            {/* Footer */}

            <div className="table-footer">

              <span>
                Showing{" "}
                {sortedUsers.length === 0
                  ? 0
                  : startIndex + 1}
                –
                {Math.min(
                  startIndex +
                    paginatedUsers.length,
                  sortedUsers.length
                )}{" "}
                of {sortedUsers.length}
              </span>

              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />

            </div>

          </>

        )}

      </div>

      {/* Create / Edit Modal */}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
          resetForm();
        }}
        title={
          editingUser
            ? "Edit User"
            : "Add User"
        }
      >

        <form
          className="user-form"
          onSubmit={handleSubmit}
          noValidate
        >

          <FormField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="Enter full name"
            required
            error={formErrors.name}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleFormChange}
            placeholder="Enter email address"
            required
            error={formErrors.email}
          />

          <div className="form-row">

            <FormField
              label="Role"
              name="role"
              value={form.role}
              onChange={handleFormChange}
              required
              error={formErrors.role}
            >
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleFormChange}
                className={
                  formErrors.role
                    ? "form-input-error"
                    : ""
                }
              >
                <option value="Administrator">
                  Administrator
                </option>

                <option value="Manager">
                  Manager
                </option>

                <option value="Developer">
                  Developer
                </option>

                <option value="Designer">
                  Designer
                </option>

                <option value="Employee">
                  Employee
                </option>
              </select>
            </FormField>

            <FormField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleFormChange}
              required
              error={formErrors.status}
            >
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className={
                  formErrors.status
                    ? "form-input-error"
                    : ""
                }
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </FormField>

          </div>

          {/* Modal Actions */}

          <div className="modal-form-actions">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setModalOpen(false);
                setEditingUser(null);
                resetForm();
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingUser
                ? "Update User"
                : "Create User"}
            </button>

          </div>

        </form>

      </Modal>

      {/* Single Delete Confirmation */}

      <ConfirmModal
        isOpen={deleteModal}
        title="Delete User"
        message={`Are you sure you want to delete ${
          deletingUser?.name || "this user"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModal(false);
          setDeletingUser(null);
        }}
      />

      {/* Bulk Delete Confirmation */}

      <ConfirmModal
        isOpen={bulkDeleteModal}
        title="Delete Selected Users"
        message={`Are you sure you want to delete ${
          selectedUsers.length
        } selected users? This action cannot be undone.`}
        confirmText="Delete Users"
        cancelText="Cancel"
        onConfirm={handleBulkDelete}
        onCancel={() =>
          setBulkDeleteModal(false)
        }
      />

    </div>
  );
};

export default Users;
