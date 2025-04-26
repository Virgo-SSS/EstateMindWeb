import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../layout/AppLayout";
import Label from "../../components/ui/label/Label";
import Input from "../../components/ui/input/Input";
import Button from "../../components/ui/button/Button";
import Select from "../../components/ui/input/Select";
import { Download, ListPlus, LoaderCircle, Sheet, Trash2 } from 'lucide-react';
import { useRef, useState } from "react";
import parseSalesFromExcel from "../../helper/parseSalesFromExcel";

export default function CreateSale({ projects }) {
  const newData = {
    project: "",
    date: new Date().toISOString().slice(0, 7),
    quantity: "",
  };

  const [processingFile, setProcessingFile] = useState(false);
  const fileInputRef = useRef(null);

  const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
    sales: [newData],
  });

  const handleNewInputGroup = (e) => {
    e.preventDefault();
    setData((prevData) => ({
      ...prevData,
      sales: [...prevData.sales, newData],
    }));
  };

  const handleRemoveInputGroup = (index) => {
    setData((prevData) => {
      const newSales = [...prevData.sales];
      newSales.splice(index, 1);
      return { ...prevData, sales: newSales };
    });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    setData((prevData) => {
      const updatedSales = [...prevData.sales];
      updatedSales[index] = {
        ...updatedSales[index],
        [name]: value,
      };
      return { ...prevData, sales: updatedSales };
    });

    // Clear error for the specific field
    clearErrors(`sales.${index}.${name}`);
  };

  const validateForm = () => {
    const requiredFields = ["project", "date", "quantity"];
    let allFieldsFilled = true;

    data.sales.forEach((item, index) => {
      requiredFields.forEach((field) => {
        if (!item[field]) {
          allFieldsFilled = false;

          let errorMessage = `${field} is required`;

          setError(`sales.${index}.${field}`, errorMessage);
        } else {
          clearErrors(`sales.${index}.${field}`);
        }
      });
    });

    return allFieldsFilled;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setData((prevData) => ({ ...prevData }));
      return;
    }

    post(route("sales.store"), {
      onSuccess: () => {
        reset();
      },
      onError: (err) => {
        console.log("Failed to create sale:", err);
      }
    });
  };

  const handleFileChange = (e) => {
    console.log("File changed:", e.target.files);
    e.preventDefault();
    setProcessingFile(true);

    const file = e.target.files;
    if (!validateFile(file)) {
      setProcessingFile(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const salesData = parseSalesFromExcel(data, projects);

      if (!salesData) {
        setProcessingFile(false);
        return;
      }

      setData((prevData) => ({
        ...prevData,
        sales: salesData,
      }));

      // Reset file input value so same file triggers onChange again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.onerror = (error) => {
      // TODO: Show error message to user
      // You can use a toast notification or any other method to show the error
      console.error("Error reading file:", error);
    }

    reader.readAsArrayBuffer(file[0]);

    setProcessingFile(false);
  }

  const validateFile = (files) => {
    if (!files || files.length === 0) {
      setProcessingFile(false);
      return false;
    }

    const fileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!fileTypes.includes(files[0].type)) {
      // TODO: Show error message to user
      // You can use a toast notification or any other method to show the error
      console.log("Invalid file type. Please upload an Excel file.");
      return false;
    }

    return true;
  }

  return (
    <>
      <AppLayout>
        {/* Header & Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            href={route("sales.index")}
            className="text-xl font-semibold text-gray-800 dark:text-white/90"
          >
            Sales
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-6xl mx-auto">
            <div className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Create Sale</h3>
              <div>
                <a href={route("sales.download.sample")} target="_blank">
                  <Button
                    type="button"
                    size="xs"
                    startIcon={<Download className="w-4 h-4" />}
                    className="bg-cyan-600 text-white hover:bg-cyan-700 mr-2"
                  >
                    Download Sample Excel
                  </Button>
                </a>
                <Button
                  type="button"
                  size="xs"
                  startIcon={<Sheet className="w-4 h-4" />}
                  className="bg-green-500 text-white hover:bg-green-600"
                  onClick={() => document.getElementById("file").click()}
                  disabled={processingFile}
                >
                  Import Excel
                  {
                    processingFile && (
                      <LoaderCircle className="w-5 h-5 ml-2 text-white animate-spin" />
                    )
                  }
                </Button>
                <input ref={fileInputRef} type="file" hidden name="file" id="file" onChange={handleFileChange} />
              </div>
            </div>

            {/* Form */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {data.sales.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 relative mb-3">
                    <div className="px-6 py-4">
                      <button
                        type="button"
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white/90"
                        onClick={() => handleRemoveInputGroup(index)}
                      >
                        <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
                      {/* Project Select */}
                      <div>
                        <Label htmlFor="project">
                          Project <span className="text-error-500">*</span>
                        </Label>
                        <Select
                          id="project"
                          name="project"
                          placeholder="Select Project"
                          value={item.project}
                          required
                          options={[
                            { value: "", label: "Select Project", disabled: true },
                            ...projects.map((project) => ({
                              value: project.id,
                              label: project.name,
                            })),
                          ]}
                          onChange={(e) => handleChange(e, index)}
                          error={!!errors[`sales.${index}.project`]}
                          hint={errors[`sales.${index}.project`]}
                        />
                      </div>

                      {/* Date */}
                      <div>
                        <Label htmlFor="date">
                          Month <span className="text-error-500">*</span>
                        </Label>
                        <Input
                          id="date"
                          name="date"
                          type="month"
                          placeholder="Select Month"
                          required
                          value={item.date}
                          onChange={(e) => handleChange(e, index)}
                          error={!!errors[`sales.${index}.date`]}
                          hint={errors[`sales.${index}.date`]}
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <Label htmlFor="quantity">
                          Quantity <span className="text-error-500">*</span>
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          name="quantity"
                          required
                          placeholder="Quantity"
                          value={item.quantity}
                          onChange={(e) => handleChange(e, index)}
                          error={!!errors[`sales.${index}.quantity`]}
                          hint={errors[`sales.${index}.quantity`]}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {
                  errors.sales && (
                    <p className="mt-1.5 text-sm text-error-500">
                      {errors.sales}
                    </p>
                  )
                }

                {/* Buttons */}
                <div className="flex justify-between">
                  <Button size="xs" className="mt-4" disabled={processing}>
                    {processing && (
                      <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
                    )}
                    Create Sale
                  </Button>
                  <Button
                    size="xs"
                    className="mt-4"
                    type="button"
                    onClick={handleNewInputGroup}
                  >
                    <ListPlus className="w-4 h-4 mr-0.5" />
                    Add Another Sale
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
