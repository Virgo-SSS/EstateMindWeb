import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import AppLayout from "../../layout/AppLayout";
import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import Button from "../../components/ui/button/Button";
import Label from "../../components/ui/label/Label";
import Input from "../../components/ui/input/Input";

export default function Password() {
  const [showPassword, setShowPassword] = useState(false);
  const pageProps = usePage().props;

  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset,
    setError,
    clearErrors,
  } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    post(route("settings.password.update"), {
      onSuccess: () => {
        reset();
      },
      onError: (err) => {
        // TODO: Handle error case (e.g., show a toast notification)
        console.log("Failed to update password:", err);
      },
    });
  };

  const validateForm = () => {
    const requiredFields = [
      "current_password",
      "password",
      "password_confirmation",
    ];
    let allFieldsFilled = true;

    requiredFields.forEach((field) => {
      if (!data[field]) {
        if (field == "current_password") {
          setError(field, "Current password is required");
        } else {
          setError(
            field,
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          );
        }

        allFieldsFilled = false;
      } else {
        clearErrors(field);
      }
    });

    return allFieldsFilled;
  };

  return (
    <>
      <AppLayout>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Profile
          </h3>
          <div className="space-y-6">
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                  <div className="order-3 xl:order-2">
                    <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                      {pageProps.auth.user
                        ? pageProps.auth.user.name
                        : "User Name"}
                    </h4>
                    <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {pageProps.auth.user
                          ? pageProps.auth.user.email
                          : "User Email"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3 lg:gap-0.5 lg:items-start lg:justify-between">
                  <div className="flex justify-between w-full">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        Password
                      </h4>
                    </div>
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer"
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:flex-row lg:gap-10 w-full">
                    <div className="size-full">
                      <Label htmlFor={"current_password"}>
                        Current Password{" "}
                        <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        id="current_password"
                        name="current_password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                        required
                        value={data.current_password}
                        onChange={(e) =>
                          setData("current_password", e.target.value)
                        }
                        error={!!errors.current_password}
                        hint={errors.current_password}
                      />
                    </div>
                    <div className="size-full">
                      <Label htmlFor={"password"}>
                        New Password{" "}
                        <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={!!errors.password}
                        hint={errors.password}
                      />
                    </div>
                    <div className="size-full">
                      <Label htmlFor={"confirm_password"}>
                        Confirm Password{" "}
                        <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        id="confirm_password"
                        name="confirm_password"
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                          setData("password_confirmation", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    {pageProps.flash.success && (
                      <div className="text-sm text-green-500 mb-2">
                        {pageProps.flash.success}
                      </div>
                    )}
                    <Button size="sm" disabled={processing}>
                      {processing && (
                        <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
                      )}
                      Update Password
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
