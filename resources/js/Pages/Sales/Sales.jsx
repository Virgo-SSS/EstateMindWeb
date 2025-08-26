import { Link, useForm, router } from "@inertiajs/react";
import AppLayout from "../../layout/AppLayout";
import Button from "../../components/ui/button/Button";
import {
  CopyPlus,
  LoaderCircle,
  Pencil,
  Trash2,
  Filter,
  X,
} from "lucide-react";
import TableCard from "../../components/ui/table/TableCard";
import TableCardBody from "../../components/ui/table/TableCardBody";
import TableCardHeader from "../../components/ui/table/TableCardHeader";
import TableHeaderCell from "../../components/ui/table/TableHeaderCell";
import Table from "../../components/ui/table/Table";
import TableHeader from "../../components/ui/table/TableHeader";
import { useCallback, useMemo, useState } from "react";
import EmptyTableRow from "../../components/ui/table/EmptyTableRow";
import TableDataCell from "../../components/ui/table/TableDataCell";
import WarningModal from "../../components/ui/modal/WarningModal";
import Select from "../../components/ui/input/Select";
import { useModal } from "../../hooks/useModal";

export default function Sales({ sales, projects = [], filters = {} }) {
  console.log(sales);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedProject, setSelectedProject] = useState(filters.project || "");
  const [isFiltering, setIsFiltering] = useState(false);

  const deleteForm = useForm({
    sale: null,
  });

  const confirmDelete = useCallback(
    (sale) => {
      deleteForm.setData("sale", sale);
      openModal();
    },
    [deleteForm, openModal]
  );

  const handleDelete = (e) => {
    e.preventDefault();

    if (!deleteForm.data.sale?.id) {
      // TODO: Handle error case (e.g., show a toast notification)
      console.error("No sale selected for deletion.");
      closeModal();
      return;
    }

    deleteForm.delete(route("sales.destroy", deleteForm.data.sale.id), {
      onSuccess: () => {
        closeModal();
        deleteForm.reset();
      },
      onError: (errors) => {
        // TODO: Handle error case (e.g., show a toast notification)
        console.error("Failed to delete sales:", errors);
      },
    });
  };

  const handleProjectChange = useCallback((e) => {
    setSelectedProject(e.target.value);
  }, []);

  const applyFilter = useCallback(() => {
    setIsFiltering(true);

    router.get(
      route("sales.index"),
      {
        project: selectedProject === "" ? undefined : selectedProject,
      },
      {
        preserveState: false,
        preserveScroll: false,
        onFinish: () => setIsFiltering(false),
      }
    );
  }, [selectedProject]);

  const clearFilters = useCallback(() => {
    setSelectedProject("");
    setIsFiltering(true);

    router.get(
      route("sales.index"),
      {},
      {
        preserveState: false,
        preserveScroll: false,
        onFinish: () => setIsFiltering(false),
      }
    );
  }, []);

  const hasSales = useMemo(() => {
    return sales.data.length > 0;
  }, [sales]);

  const hasActiveFilters = useMemo(() => {
    return filters.project && filters.project !== "";
  }, [filters]);

  return (
    <>
      <AppLayout>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Sales
          </h2>
          <Link href={route("sales.create")}>
            <Button size="xs" startIcon={<CopyPlus className="w-4 h-4 mr-2" />}>
              New Sale
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <TableCard>
            <TableCardHeader>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Sales List
                  {hasActiveFilters && (
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      (Filtered)
                    </span>
                  )}
                </h3>
              </div>
              <div className="flex gap-3 items-center">
                <div className="min-w-48">
                  <Select
                    id="project-filter"
                    name="project-filter"
                    placeholder="All Projects"
                    value={selectedProject}
                    onChange={handleProjectChange}
                    options={[
                      {
                        value: "",
                        label: "All Projects",
                      },
                      ...projects.map((project) => ({
                        value: project.id,
                        label: project.name,
                      })),
                    ]}
                  />
                </div>
                <Button
                  size="xs"
                  onClick={applyFilter}
                  disabled={isFiltering}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  startIcon={
                    isFiltering ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <Filter className="w-4 h-4" />
                    )
                  }
                >
                  {isFiltering ? "Filtering..." : "Filter"}
                </Button>
                {hasActiveFilters && (
                  <Button
                    size="xs"
                    onClick={clearFilters}
                    disabled={isFiltering}
                    className="bg-gray-500 text-white hover:bg-gray-600"
                    startIcon={<X className="w-4 h-4" />}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </TableCardHeader>
            <TableCardBody>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>Project</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Quantity</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {hasSales ? (
                    sales.data.map((sale) => (
                      <tr key={sale.id}>
                        <TableDataCell>{sale.project.name}</TableDataCell>
                        <TableDataCell>
                          {new Date(sale.date).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </TableDataCell>
                        <TableDataCell>{sale.quantity}</TableDataCell>
                        <TableDataCell>
                          <Link href={route("sales.edit", sale.id)}>
                            <button className="text-blue-500 hover:text-blue-700">
                              <Pencil className="w-4.5 h-4.5 mr-2" />
                            </button>
                          </Link>
                          <span className="mx-2">|</span>
                          <button
                            type="button"
                            aria-label={`Delete Sales`}
                            onClick={() => confirmDelete(sale)}
                            disabled={deleteForm.processing}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4.5 h-4.5 ml-2 cursor-pointer " />
                          </button>
                        </TableDataCell>
                      </tr>
                    ))
                  ) : (
                    <EmptyTableRow
                      message={
                        hasActiveFilters
                          ? "No sales found matching the selected filters"
                          : "No sales found"
                      }
                    />
                  )}
                </tbody>
              </Table>
            </TableCardBody>
          </TableCard>
          {sales.data.length > 0 && (
            <div className="mt-4">
              <nav
                className="inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                {sales.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || "#"}
                    className={`${
                      link.active
                        ? "z-10 bg-primary-500 text-white hover:bg-primary-600"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    } relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    as="button"
                    disabled={!link.url}
                  />
                ))}
              </nav>
            </div>
          )}
        </div>
      </AppLayout>
      <WarningModal
        isOpen={isOpen}
        onClose={closeModal}
        title={`Delete sale`}
        message={`Are you sure you want to delete sale? This action cannot be undone.`}
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
            Delete sale
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
