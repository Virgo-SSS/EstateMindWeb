import { LoaderCircle } from "lucide-react";
import Button from "../../components/ui/button/Button";
import Input from "../../components/ui/input/Input";
import Select from "../../components/ui/input/Select";
import Label from "../../components/ui/label/Label";
import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../layout/AppLayout";

export default function EditSale({ sale }) {
  const { data, setData, put, processing, errors, reset } = useForm({
    quantity: sale.quantity,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      delete errors[name];
    }
    setData(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.quantity) {
      errors.quantity = "Quantity is required";
      setData("quantity", "");
      return;
    }

    put(route("sales.update", sale.id), {
      onSuccess: () => {
        reset();
      },
      onError: (err) => {
        // TODO: Handle error case (e.g., show a toast notification)
        console.log("Failed to edit sale:", err);
      },
    });
  };

  return (
    <>
      <AppLayout>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            href={route("sales.index")}
            className="text-xl font-semibold text-gray-800 dark:text-white/90"
          >
            Sales
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-2/3 mx-auto">
            <div className="px-6 py-5">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Edit Sale
              </h3>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="space-y-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="project">
                        Project <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        id="project"
                        name="project"
                        value={sale.project.name}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">
                        Month <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative w-full flatpickr-wrapper">
                        <Input
                          id="date"
                          name="date"
                          type="month"
                          value={sale.date}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="quantity">
                        Quantity <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        name="quantity"
                        required={true}
                        placeholder="Quantity"
                        value={data.quantity}
                        onChange={handleChange}
                        error={errors.quantity ? true : false}
                        hint={errors.quantity}
                      />
                    </div>
                  </div>
                  <Button className="mt-4" disabled={processing}>
                    {processing && (
                      <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
                    )}
                    Update Sale
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
