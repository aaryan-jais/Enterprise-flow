import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  FolderKanban,
  CheckSquare,
  Square,
  Trash,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../store/slices/projectSlice";

import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";
import FormField from "../components/common/FormField";
import ErrorState from "../components/common/ErrorState";
import { useToast } from "../components/common/ToastContext";

const Projects = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const {
    projects,
    loading,
    error,
  } = useSelector((state) => state.projects);

  // ----------------------------------
  // State
  // ----------------------------------

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedProjects, setSelectedProjects] =
    useState([]);

  const [sortConfig, setSortConfig] =
    useState({
      key: "name",
      direction: "asc",
    });

  const [modalOpen, setModalOpen] =
    useState(false);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [bulkDeleteModal, setBulkDeleteModal] =
    useState(false);

  const [editingProject, setEditingProject] =
    useState(null);

  const [deletingProject, setDeletingProject] =
    useState(null);

  const [formErrors, setFormErrors] =
    useState({});

  const [form, setForm] = useState({
    name: "",
    client: "",
    status: "Planning",
    progress: 0,
    manager: "",
  });

  const itemsPerPage = 6;

  // ----------------------------------
  // Fetch Projects
  // ----------------------------------

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // ----------------------------------
  // Reset page on search/filter
  // ----------------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // ----------------------------------
  // Clear selection on page change
  // ----------------------------------

  useEffect(() => {
    setSelectedProjects([]);
  }, [currentPage]);

  // ----------------------------------
  // Search + Filter
  // ----------------------------------

  const filteredProjects = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return (projects || []).filter(
      (project) => {
        const matchesSearch =
          !query ||
          [
            project.name,
            project.client,
            project.status,
            project.manager,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        const matchesStatus =
          statusFilter === "All" ||
          project.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    projects,
    search,
    statusFilter,
  ]);

  // ----------------------------------
  // Sorting
  // ----------------------------------

  const sortedProjects = useMemo(() => {
    const result = [
      ...filteredProjects,
    ];

    result.sort((a, b) => {
      let first =
        a?.[sortConfig.key] ?? "";

      let second =
        b?.[sortConfig.key] ?? "";

      if (
        sortConfig.key === "progress"
      ) {
        first = Number(first);
        second = Number(second);
      } else {
        first = String(first).toLowerCase();
        second =
          String(second).toLowerCase();
      }

      if (first < second) {
        return sortConfig.direction ===
          "asc"
          ? -1
          : 1;
      }

      if (first > second) {
        return sortConfig.direction ===
          "asc"
          ? 1
          : -1;
      }

      return 0;
    });

    return result;
  }, [
    filteredProjects,
    sortConfig,
  ]);

  // ----------------------------------
  // Pagination
  // ----------------------------------

  const totalPages = Math.ceil(
    sortedProjects.length /
      itemsPerPage
  );

  const safePage =
    totalPages > 0 &&
    currentPage > totalPages
      ? totalPages
      : currentPage;

  const startIndex =
    (safePage - 1) *
    itemsPerPage;

  const paginatedProjects =
    sortedProjects.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // ----------------------------------
  // Selection
  // ----------------------------------

  const pageProjectIds =
    paginatedProjects.map((project) =>
      String(project.id)
    );

  const allPageSelected =
    paginatedProjects.length > 0 &&
    paginatedProjects.every((project) =>
      selectedProjects.includes(
        String(project.id)
      )
    );

  const toggleProjectSelection = (id) => {
    const stringId = String(id);

    setSelectedProjects((prev) =>
      prev.includes(stringId)
        ? prev.filter(
            (projectId) =>
              projectId !== stringId
          )
        : [
            ...prev,
            stringId,
          ]
    );
  };

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedProjects((prev) =>
        prev.filter(
          (id) =>
            !pageProjectIds.includes(id)
        )
      );
    } else {
      setSelectedProjects((prev) => [
        ...new Set([
          ...prev,
          ...pageProjectIds,
        ]),
      ]);
    }
  };

  // ----------------------------------
  // Sorting
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

    return sortConfig.direction ===
      "asc" ? (
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
      client: "",
      status: "Planning",
      progress: 0,
      manager: "",
    });

    setFormErrors({});
  };

  const openCreateModal = () => {
    setEditingProject(null);
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    setForm({
      name: project.name || "",
      client: project.client || "",
      status:
        project.status || "Planning",
      progress:
        Number(project.progress) || 0,
      manager:
        project.manager || "",
    });

    setFormErrors({});
    setModalOpen(true);
  };

  const handleFormChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "progress"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ----------------------------------
  // Validation
  // ----------------------------------

  const validateForm = () => {
    const errors = {};

    const name = form.name.trim();
    const client = form.client.trim();
    const progress = Number(form.progress);

    if (!name) {
      errors.name =
        "Project name is required.";
    } else if (name.length < 2) {
      errors.name =
        "Project name must be at least 2 characters.";
    }

    if (!client) {
      errors.client =
        "Client name is required.";
    } else if (client.length < 2) {
      errors.client =
        "Client name must be at least 2 characters.";
    }

    if (
      form.progress === "" ||
      Number.isNaN(progress) ||
      progress < 0 ||
      progress > 100
    ) {
      errors.progress =
        "Progress must be between 0 and 100.";
    }

    if (!form.status) {
      errors.status =
        "Project status is required.";
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

    const projectData = {
      name: form.name.trim(),
      client: form.client.trim(),
      status: form.status,
      progress: Number(form.progress),
      manager: form.manager.trim(),
    };

    try {
      if (editingProject) {
        await dispatch(
          updateProject({
            id: editingProject.id,
            projectData,
          })
        ).unwrap();

        showToast(
          "Project updated successfully"
        );
      } else {
        await dispatch(
          createProject(projectData)
        ).unwrap();

        showToast(
          "Project created successfully"
        );
      }

      setModalOpen(false);
      setEditingProject(null);
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

  const openDeleteModal = (project) => {
    setDeletingProject(project);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingProject) {
      return;
    }

    try {
      await dispatch(
        deleteProject(
          deletingProject.id
        )
      ).unwrap();

      setSelectedProjects((prev) =>
        prev.filter(
          (id) =>
            id !==
            String(
              deletingProject.id
            )
        )
      );

      showToast(
        "Project deleted successfully"
      );
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to delete project",
        "error"
      );
    } finally {
      setDeleteModal(false);
      setDeletingProject(null);
    }
  };

  // ----------------------------------
  // Bulk Delete
  // ----------------------------------

  const handleBulkDelete = async () => {
    if (
      selectedProjects.length === 0
    ) {
      return;
    }

    try {
      for (const id of selectedProjects) {
        await dispatch(
          deleteProject(id)
        ).unwrap();
      }

      showToast(
        `${selectedProjects.length} projects deleted successfully`
      );

      setSelectedProjects([]);
      setBulkDeleteModal(false);
    } catch (err) {
      showToast(
        typeof err === "string"
          ? err
          : "Failed to delete selected projects",
        "error"
      );
    }
  };

  // ----------------------------------
  // Status Class
  // ----------------------------------

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "project-status completed";

      case "In Progress":
        return "project-status progress";

      case "On Hold":
        return "project-status hold";

      default:
        return "project-status planning";
    }
  };

  // ----------------------------------
  // UI
  // ----------------------------------

  return (
    <div className="page-container">

      {/* Page Header */}

      <div className="page-header">

        <div>
          <h1>Projects</h1>

          <p>
            Track and manage enterprise
            projects.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          <Plus size={17} />
          Add Project
        </button>

      </div>

      {/* Projects Card */}

      <div className="dashboard-card projects-card">

        {/* Toolbar */}

        <div className="project-toolbar">

          <div className="table-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <div className="project-filters">

            <button
              type="button"
              className={
                statusFilter === "All"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter("All")
              }
            >
              All
            </button>

            <button
              type="button"
              className={
                statusFilter ===
                "Planning"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter(
                  "Planning"
                )
              }
            >
              Planning
            </button>

            <button
              type="button"
              className={
                statusFilter ===
                "In Progress"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter(
                  "In Progress"
                )
              }
            >
              In Progress
            </button>

            <button
              type="button"
              className={
                statusFilter ===
                "Completed"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter(
                  "Completed"
                )
              }
            >
              Completed
            </button>

            <button
              type="button"
              className={
                statusFilter ===
                "On Hold"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter(
                  "On Hold"
                )
              }
            >
              On Hold
            </button>

          </div>

        </div>

        {/* Bulk Toolbar */}

        {selectedProjects.length > 0 && (
          <div className="bulk-toolbar">

            <div className="bulk-selected">

              <CheckSquare size={17} />

              <strong>
                {selectedProjects.length}
              </strong>

              <span>
                selected
              </span>

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
            Loading projects...
          </div>

        ) : error ? (

          <ErrorState
            message={error}
            onRetry={() =>
              dispatch(fetchProjects())
            }
          />

        ) : paginatedProjects.length ===
          0 ? (

          <div className="table-empty">

            <FolderKanban
              size={34}
            />

            <h3>
              No projects found
            </h3>

            <p>
              Try changing your search
              or status filter.
            </p>

          </div>

        ) : (

          <>
            {/* Project Table */}

            <div className="table-responsive">

              <table className="data-table project-table">

                <thead>

                  <tr>

                    <th className="checkbox-column">

                      <button
                        type="button"
                        className="table-checkbox"
                        onClick={
                          toggleSelectAll
                        }
                        aria-label="Select all projects"
                      >
                        {allPageSelected ? (
                          <CheckSquare
                            size={17}
                          />
                        ) : (
                          <Square
                            size={17}
                          />
                        )}
                      </button>

                    </th>

                    <th>

                      <button
                        type="button"
                        className="sort-button"
                        onClick={() =>
                          handleSort("name")
                        }
                      >
                        Project
                        {getSortIcon(
                          "name"
                        )}
                      </button>

                    </th>

                    <th>

                      <button
                        type="button"
                        className="sort-button"
                        onClick={() =>
                          handleSort(
                            "client"
                          )
                        }
                      >
                        Client
                        {getSortIcon(
                          "client"
                        )}
                      </button>

                    </th>

                    <th>

                      <button
                        type="button"
                        className="sort-button"
                        onClick={() =>
                          handleSort(
                            "status"
                          )
                        }
                      >
                        Status
                        {getSortIcon(
                          "status"
                        )}
                      </button>

                    </th>

                    <th>

                      <button
                        type="button"
                        className="sort-button"
                        onClick={() =>
                          handleSort(
                            "progress"
                          )
                        }
                      >
                        Progress
                        {getSortIcon(
                          "progress"
                        )}
                      </button>

                    </th>

                    <th>
                      Manager
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {paginatedProjects.map(
                    (project) => {

                      const projectId =
                        String(
                          project.id
                        );

                      const isSelected =
                        selectedProjects.includes(
                          projectId
                        );

                      const progress =
                        Math.min(
                          100,
                          Math.max(
                            0,
                            Number(
                              project.progress
                            ) || 0
                          )
                        );

                      return (
                        <tr
                          key={
                            project.id
                          }
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
                                toggleProjectSelection(
                                  project.id
                                )
                              }
                              aria-label={`Select ${
                                project.name ||
                                "project"
                              }`}
                            >
                              {isSelected ? (
                                <CheckSquare
                                  size={17}
                                />
                              ) : (
                                <Square
                                  size={17}
                                />
                              )}
                            </button>

                          </td>

                          {/* Project */}

                          <td>

                            <div className="project-name-cell">

                              <div className="project-icon">

                                <FolderKanban
                                  size={16}
                                />

                              </div>

                              <div>

                                <strong>
                                  {project.name ||
                                    "Unnamed Project"}
                                </strong>

                                <span>
                                  ID: #
                                  {
                                    project.id
                                  }
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* Client */}

                          <td>
                            {project.client ||
                              "—"}
                          </td>

                          {/* Status */}

                          <td>

                            <span
                              className={getStatusClass(
                                project.status
                              )}
                            >
                              {project.status ||
                                "Planning"}
                            </span>

                          </td>

                          {/* Progress */}

                          <td>

                            <div className="progress-cell">

                              <div className="progress-info">

                                <span>
                                  {progress}%
                                </span>

                              </div>

                              <div className="progress-track">

                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                />

                              </div>

                            </div>

                          </td>

                          {/* Manager */}

                          <td>
                            {project.manager ||
                              "—"}
                          </td>

                          {/* Actions */}

                          <td>

                            <div className="table-actions">

                              <button
                                type="button"
                                className="icon-action edit"
                                onClick={() =>
                                  openEditModal(
                                    project
                                  )
                                }
                                title="Edit"
                                aria-label="Edit project"
                              >
                                <Edit3
                                  size={15}
                                />
                              </button>

                              <button
                                type="button"
                                className="icon-action delete"
                                onClick={() =>
                                  openDeleteModal(
                                    project
                                  )
                                }
                                title="Delete"
                                aria-label="Delete project"
                              >
                                <Trash2
                                  size={15}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            {/* Footer */}

            <div className="table-footer">

              <span>
                Showing{" "}
                {sortedProjects.length ===
                0
                  ? 0
                  : startIndex + 1}
                –
                {Math.min(
                  startIndex +
                    paginatedProjects.length,
                  sortedProjects.length
                )}{" "}
                of{" "}
                {sortedProjects.length}
              </span>

              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={
                  setCurrentPage
                }
              />

            </div>

          </>

        )}

      </div>

      {/* Create / Edit Project Modal */}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProject(null);
          resetForm();
        }}
        title={
          editingProject
            ? "Edit Project"
            : "Add Project"
        }
      >

        <form
          className="user-form"
          onSubmit={handleSubmit}
          noValidate
        >

          <FormField
            label="Project Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="Enter project name"
            required
            error={formErrors.name}
          />

          <FormField
            label="Client"
            name="client"
            value={form.client}
            onChange={handleFormChange}
            placeholder="Enter client name"
            required
            error={formErrors.client}
          />

          <div className="form-row">

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
                onChange={
                  handleFormChange
                }
                className={
                  formErrors.status
                    ? "form-input-error"
                    : ""
                }
              >
                <option value="Planning">
                  Planning
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="On Hold">
                  On Hold
                </option>
              </select>
            </FormField>

            <FormField
              label="Progress (%)"
              name="progress"
              type="number"
              value={form.progress}
              onChange={handleFormChange}
              required
              error={formErrors.progress}
            />

          </div>

          <FormField
            label="Project Manager"
            name="manager"
            value={form.manager}
            onChange={handleFormChange}
            placeholder="Enter manager name"
          />

          {/* Modal Actions */}

          <div className="modal-form-actions">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setModalOpen(false);
                setEditingProject(null);
                resetForm();
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingProject
                ? "Update Project"
                : "Create Project"}
            </button>

          </div>

        </form>

      </Modal>

      {/* Single Delete */}

      <ConfirmModal
        isOpen={deleteModal}
        title="Delete Project"
        message={`Are you sure you want to delete ${
          deletingProject?.name ||
          "this project"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModal(false);
          setDeletingProject(null);
        }}
      />

      {/* Bulk Delete */}

      <ConfirmModal
        isOpen={bulkDeleteModal}
        title="Delete Selected Projects"
        message={`Are you sure you want to delete ${
          selectedProjects.length
        } selected projects? This action cannot be undone.`}
        confirmText="Delete Projects"
        cancelText="Cancel"
        onConfirm={handleBulkDelete}
        onCancel={() =>
          setBulkDeleteModal(false)
        }
      />

    </div>
  );
};

export default Projects;
