import { useForm } from "@inertiajs/react";
import { useCallback, useState, useEffect, useMemo } from "react";
import { Trash2, LoaderCircle, MoveLeft, MoveRight } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import WarningModal from "../../components/ui/modal/WarningModal";
import Button from "../../components/ui/button/Button";
import EmptyTableRow from "../../components/ui/table/EmptyTableRow";
import Table from "../../components/ui/table/Table";
import TableHeaderCell from "../../components/ui/table/TableHeaderCell";
import TableDataCell from "../../components/ui/table/TableDataCell";
import TableCard from "../../components/ui/table/TableCard";
import TableCardHeader from "../../components/ui/table/TableCardHeader";
import TableCardBody from "../../components/ui/table/TableCardBody";
import { Search } from "lucide-react";
import Input from "../../components/ui/input/Input";
import { useDebouncedCallback } from "use-debounce";

const TABLE_HEADERS = ["No", "Project Name", "Action"];
const EMPTY_PROJECT = { id: null, name: "" };

export default function TableListProject({ projects }) {
  const [projectToEdit, setProjectToEdit] = useState(EMPTY_PROJECT);
  const { isOpen, openModal, closeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const editForm = useForm({
    name: "",
  });

  const deleteForm = useForm({
    project: null,
  });

  useEffect(() => {
    return () => {
      editForm.reset();
      deleteForm.reset();
    };
  }, []);

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  // Add debounced search function to prevent excessive filtering
  const debouncedSearch = useDebouncedCallback((query) => {
    if (!query.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const lowercaseQuery = query.toLowerCase().trim();
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(lowercaseQuery),
    );

    setFilteredProjects(filtered);
  }, 500);

  const handleLiveSearch = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch, projects],
  );

  // Handlers with useCallback for better performance
  const cancelEditing = useCallback(() => {
    setProjectToEdit(EMPTY_PROJECT);
    editForm.reset();
  }, [editForm]);

  const startEditing = useCallback(
    (project) => {
      editForm.setData("name", project.name);
      setProjectToEdit(project);
    },
    [editForm],
  );

  const handleUpdate = useCallback(
    (e) => {
      e?.preventDefault();

      // Don't submit if name is empty or unchanged
      if (!editForm.data.name || editForm.data.name === projectToEdit.name) {
        cancelEditing();
        return;
      }

      editForm.put(route("projects.update", projectToEdit.id), {
        onSuccess: cancelEditing,
        onError: (errors) => {
          // TODO: Handle error case (e.g., show a toast notification)
          console.error("Failed to update project:", errors);
        },
      });
    },
    [editForm, projectToEdit, cancelEditing],
  );

  const handleOnBlur = useCallback(
    (e) => {
      // Handle empty input or unchanged values
      if (e.target.value === "" || e.target.value === projectToEdit.name) {
        cancelEditing();
        return;
      }

      handleUpdate(e);
    },
    [projectToEdit, handleUpdate, cancelEditing],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleUpdate(e);
      } else if (e.key === "Escape") {
        cancelEditing();
      }
    },
    [handleUpdate, cancelEditing],
  );

  const confirmDelete = useCallback(
    (project) => {
      deleteForm.setData("project", project);
      openModal();
    },
    [deleteForm, openModal],
  );

  const handleDelete = useCallback(
    (e) => {
      e.preventDefault();

      if (!deleteForm.data.project?.id) {
        // TODO: Handle error case (e.g., show a toast notification)
        console.error("No project selected for deletion.");
        closeModal();
        return;
      }

      deleteForm.delete(route("projects.destroy", deleteForm.data.project.id), {
        onSuccess: () => {
          closeModal();
          deleteForm.reset();
        },
        onError: (errors) => {
          // TODO: Handle error case (e.g., show a toast notification)
          console.error("Failed to delete project:", errors);
        },
      });
    },
    [deleteForm, closeModal],
  );

  // Memoized empty state check
  const hasProjects = useMemo(
    () => filteredProjects && filteredProjects.length > 0,
    [filteredProjects],
  );

  return (
    <>
      <TableCard>
        <TableCardHeader>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Project Lists
            </h3>
          </div>
          <div>
            <Input
              id="search"
              name="search"
              placeholder={"Search project..."}
              icon={
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              }
              iconPosition="left"
              onChange={handleLiveSearch}
              value={searchQuery}
            />
          </div>
        </TableCardHeader>
        <TableCardBody>
          <Table>
            <thead className="border-b border-gray-100 dark:border-white/[0.05]">
              <tr>
                {TABLE_HEADERS.map((name, index) => (
                  <TableHeaderCell key={index}>{name}</TableHeaderCell>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {hasProjects ? (
                filteredProjects.map((project, index) => (
                  <tr key={project.id}>
                    <TableDataCell>{index + 1}</TableDataCell>

                    <TableDataCell>
                      {projectToEdit.id === project.id ? (
                        <>
                          <div className="flex items-center gap-2 w-1/2">
                            <input
                              type="text"
                              value={editForm.data.name}
                              onChange={(e) =>
                                editForm.setData("name", e.target.value)
                              }
                              onBlur={handleOnBlur}
                              onKeyDown={handleKeyDown}
                              autoFocus
                              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              disabled={editForm.processing}
                              maxLength={100}
                              aria-label="Edit project name"
                            />
                            {editForm.processing && (
                              <LoaderCircle
                                className="w-5 h-5 ml-2 text-gray-500 animate-spin"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          <div>
                            {editForm.errors.name && (
                              <span className="text-red-500 text-sm">
                                {editForm.errors.name}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="text-left cursor-pointer hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 -ml-2"
                          onClick={() => startEditing(project)}
                          aria-label={`Edit ${project.name}`}
                        >
                          {project.name}
                        </button>
                      )}
                    </TableDataCell>

                    <TableDataCell>
                      <button
                        type="button"
                        aria-label={`Delete ${project.name}`}
                        className={`p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500`}
                        onClick={() => confirmDelete(project)}
                        disabled={editForm.processing || deleteForm.processing}
                      >
                        <Trash2
                          className={`w-5 h-5 text-red-600 cursor-pointer hover:text-red-700 ${editForm.processing || deleteForm.processing ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                      </button>
                    </TableDataCell>
                  </tr>
                ))
              ) : (
                <EmptyTableRow
                  message={
                    searchQuery
                      ? "No projects match your search"
                      : "No projects available"
                  }
                />
              )}
            </tbody>
          </Table>
        </TableCardBody>
      </TableCard>

      <WarningModal
        isOpen={isOpen}
        onClose={closeModal}
        title={`Delete ${deleteForm.data.project?.name} Project`}
        message={`Are you sure you want to delete ${deleteForm.data.project?.name} project? This action cannot be undone.`}
        confirmButton={
          <Button
            size="sm"
            disabled={deleteForm.processing}
            onClick={handleDelete}
            className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-warning-500 shadow-theme-xs hover:bg-warning-600 sm:w-auto"
          >
            {deleteForm.processing && (
              <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
            )}
            Delete Project
          </Button>
        }
        cancelButton={
          <Button
            type="button"
            onClick={closeModal}
            size="sm"
            disabled={deleteForm.processing}
            className="flex justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg bg-gray-500 shadow-theme-xs hover:bg-gray-700 sm:w-auto"
          >
            Cancel
          </Button>
        }
      />
    </>
  );
}
